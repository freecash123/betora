import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../wallets/wallet.service';
import { PlaceBetDto } from './dto';

@Injectable()
export class BettingService {
  private readonly logger = new Logger(BettingService.name);
  constructor(private prisma: PrismaService, private walletService: WalletService) {}

  async placeBet(userId: string, dto: PlaceBetDto, ipAddress: string) {
    const idempotencyKey = dto.idempotencyKey || `BET-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
    const existing = await this.prisma.bet.findUnique({ where: { idempotency_key: idempotencyKey } });
    if (existing) return this.formatBet(existing);
    if (!dto.selections?.length) throw new BadRequestException('At least one selection required');

    const wallet = await this.walletService.getWallet(userId);
    const balance = Number(wallet.balance_available) + Number(wallet.balance_bonus);
    if (dto.stake < 0.50 || dto.stake > 100000 || dto.stake > balance) throw new BadRequestException('Invalid stake');

    const validSelections = []; let totalOdds = 1;
    for (const sel of dto.selections) {
      const s = await this.prisma.selection.findUnique({ where: { id: sel.selectionId }, include: { market: { include: { event: true } } } });
      if (!s || s.status !== 'OPEN') throw new BadRequestException(`Selection unavailable`);
      if (Math.abs(Number(s.odds) - sel.odds) / sel.odds > 0.05) throw new BadRequestException(`Odds changed for "${s.name}"`);
      totalOdds *= sel.odds;
      validSelections.push({ s, odds: sel.odds });
    }

    const betRef = `BET-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
    const potentialWinnings = +(dto.stake * totalOdds).toFixed(2);
    await this.walletService.reserveFundsForBet(userId, dto.stake, idempotencyKey, betRef);

    const bet = await this.prisma.$transaction(async (tx) => {
      const b = await tx.bet.create({ data: { user_id: userId, bet_ref: betRef, type: dto.type as any, status: 'PENDING', stake: dto.stake, total_odds: totalOdds, potential_winnings: potentialWinnings, currency: wallet.currency as any, is_live: validSelections.some(vs => vs.s.market.event.is_live), ip_address: ipAddress, idempotency_key: idempotencyKey } });
      await tx.betSelection.createMany({ data: validSelections.map(vs => ({ bet_id: b.id, event_id: vs.s.market.event.id, market_id: vs.s.market.id, selection_id: vs.s.id, odds_taken: vs.odds, event_name: `${vs.s.market.event.home_team} vs ${vs.s.market.event.away_team}`, market_name: vs.s.market.name, selection_name: vs.s.name, home_team: vs.s.market.event.home_team, away_team: vs.s.market.event.away_team })) });
      return b;
    });

    return this.formatBet(bet);
  }

  async getBets(userId: string, status?: string, page=1, limit=20) {
    const where: any = { user_id: userId }; if (status) where.status = status;
    const [bets, total] = await Promise.all([this.prisma.bet.findMany({ where, include: { bet_selections: true }, orderBy: { placed_at: 'desc' }, skip: (page-1)*limit, take: limit }), this.prisma.bet.count({ where })]);
    return { bets: bets.map(b=>this.formatBet(b)), total, page, limit, totalPages: Math.ceil(total/limit) };
  }

  async getBet(userId: string, betId: string) {
    const bet = await this.prisma.bet.findFirst({ where: { id: betId, user_id: userId }, include: { bet_selections: true } });
    if (!bet) throw new NotFoundException('Bet not found');
    return this.formatBet(bet);
  }

  async getBetByRef(betRef: string) {
    const bet = await this.prisma.bet.findFirst({ where: { bet_ref: betRef }, include: { bet_selections: true } });
    if (!bet) throw new NotFoundException('Bet not found');
    return this.formatBet(bet);
  }

  async cashOut(userId: string, betId: string) {
    const bet = await this.prisma.bet.findFirst({ where: { id: betId, user_id: userId, status: 'PENDING' } });
    if (!bet) throw new BadRequestException('Bet not available for cash out');
    const cashOutAmount = +(Number(bet.potential_winnings) * 0.85).toFixed(2);
    await this.prisma.$transaction(async (tx) => {
      await tx.bet.update({ where: { id: betId }, data: { is_cashed_out: true, cash_out_amount: cashOutAmount, status: 'CASHED_OUT', settled_at: new Date() } });
      await tx.betSelection.updateMany({ where: { bet_id: betId }, data: { status: 'CASHED_OUT' } });
    });
    return { cashedOut: true, amount: cashOutAmount };
  }

  async getCashOutOffer(userId: string, betId: string) {
    const bet = await this.getBet(userId, betId);
    if (bet.status !== 'PENDING') return null;
    return { amount: +(Number(bet.potentialWinnings) * 0.85).toFixed(2), expiresIn: 30 };
  }

  private formatBet(b: any) {
    return { id: b.id, betRef: b.bet_ref, type: b.type, status: b.status, stake: Number(b.stake), totalOdds: Number(b.total_odds), potentialWinnings: Number(b.potential_winnings), actualWinnings: b.actual_winnings?Number(b.actual_winnings):null, currency: b.currency, isLive: b.is_live, isCashedOut: b.is_cashed_out, placedAt: b.placed_at, selections: b.bet_selections?.map((s:any)=>({selectionName:s.selection_name,eventName:s.event_name,oddsTaken:Number(s.odds_taken),status:s.status}))||[] };
  }
}