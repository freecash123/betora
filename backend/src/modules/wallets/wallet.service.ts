import { Injectable, BadRequestException, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getBalance(userId: string) {
    const w = await this.getWallet(userId);
    return { balanceAvailable: Number(w.balance_available), balancePending: Number(w.balance_pending), balanceBonus: Number(w.balance_bonus), balanceReserved: Number(w.balance_reserved), totalBalance: Number(w.balance_available) + Number(w.balance_bonus), currency: w.currency };
  }

  async reserveFundsForBet(userId: string, amount: number, idempotencyKey: string, betId: string) {
    const existing = await this.prisma.transaction.findUnique({ where: { idempotency_key: idempotencyKey } });
    if (existing) return { transactionId: existing.id, success: existing.status === 'COMPLETED' };

    return this.prisma.$transaction(async (tx: any) => {
      const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
      if (!wallet) throw new NotFoundException('Wallet not found');

      const available = Number(wallet.balance_available) + Number(wallet.balance_bonus);
      if (available < amount) throw new BadRequestException('Insufficient balance');

      const fromBonus = Math.min(Number(wallet.balance_bonus), amount);
      const fromAvailable = amount - fromBonus;

      const updated = await tx.wallet.updateMany({
        where: { user_id: userId, version: wallet.version },
        data: { balance_available: { decrement: fromAvailable }, balance_bonus: { decrement: fromBonus }, balance_reserved: { increment: amount }, version: { increment: 1 } },
      });

      if (updated.count === 0) throw new ConflictException('Wallet update conflict. Please try again.');

      const ref = `TXN-BET-${Date.now().toString(36).toUpperCase()}`;
      const txn = await tx.transaction.create({ data: { user_id: userId, wallet_id: wallet.id, transaction_ref: ref, amount, currency: wallet.currency, type: 'BET_PLACED', status: 'COMPLETED', bet_id: betId, idempotency_key: idempotencyKey, completed_at: new Date() } });

      await tx.ledgerEntry.create({ data: { wallet_id: wallet.id, user_id: userId, transaction_id: txn.id, entry_type: 'DEBIT', amount, balance_before: available, balance_after: available - amount, reference: `BET-${betId}`, description: `Bet placement - ${ref}` } });

      return { transactionId: txn.id, success: true };
    });
  }

  async deposit(userId: string, amount: number, idempotencyKey: string) {
    const existing = await this.prisma.transaction.findUnique({ where: { idempotency_key: idempotencyKey } });
    if (existing) return { transactionId: existing.id };

    return this.prisma.$transaction(async (tx: any) => {
      const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
      const ref = `TXN-DEP-${Date.now().toString(36).toUpperCase()}`;
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance_available: { increment: amount } } });
      const txn = await tx.transaction.create({ data: { user_id: userId, wallet_id: wallet.id, transaction_ref: ref, amount, currency: wallet.currency, type: 'DEPOSIT', status: 'COMPLETED', idempotency_key: idempotencyKey, completed_at: new Date() } });
      return { transactionId: txn.id };
    });
  }

  async withdraw(userId: string, amount: number, idempotencyKey: string, paymentMethodId: string) {
    const existing = await this.prisma.transaction.findUnique({ where: { idempotency_key: idempotencyKey } });
    if (existing) return { transactionId: existing.id };

    return this.prisma.$transaction(async (tx: any) => {
      const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
      if (Number(wallet.balance_available) < amount) throw new BadRequestException('Insufficient balance');
      const ref = `TXN-WDR-${Date.now().toString(36).toUpperCase()}`;
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance_available: { decrement: amount } } });
      const txn = await tx.transaction.create({ data: { user_id: userId, wallet_id: wallet.id, transaction_ref: ref, amount, currency: wallet.currency, type: 'WITHDRAWAL', status: 'COMPLETED', idempotency_key: idempotencyKey, completed_at: new Date() } });
      return { transactionId: txn.id };
    });
  }

  async getTransactions(userId: string, page: number, limit: number) {
    const [txns, total] = await Promise.all([this.prisma.transaction.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' }, skip: (page-1)*limit, take: limit }), this.prisma.transaction.count({ where: { user_id: userId } })]);
    return { transactions: txns, total, page, limit, totalPages: Math.ceil(total/limit) };
  }

  async getLedger(userId: string, page: number, limit: number) {
    const [entries, total] = await Promise.all([this.prisma.ledgerEntry.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' }, skip: (page-1)*limit, take: limit }), this.prisma.ledgerEntry.count({ where: { user_id: userId } })]);
    return { entries, total, page, limit, totalPages: Math.ceil(total/limit) };
  }
}