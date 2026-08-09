import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get() async getWallet(@Req() req) { return this.walletService.getBalance(req.user.id); }
  @Get('transactions') async getTransactions(@Req() req, @Query('page') page?: number, @Query('limit') limit?: number) { return this.walletService.getTransactions(req.user.id, page||1, limit||20); }
  @Get('ledger') async getLedger(@Req() req, @Query('page') page?: number, @Query('limit') limit?: number) { return this.walletService.getLedger(req.user.id, page||1, limit||50); }
  @Post('deposit') async deposit(@Req() req, @Body() body: {amount:number;idempotencyKey:string}) { return this.walletService.deposit(req.user.id, body.amount, body.idempotencyKey); }
  @Post('withdraw') async withdraw(@Req() req, @Body() body: {amount:number;idempotencyKey:string;paymentMethodId:string}) { return this.walletService.withdraw(req.user.id, body.amount, body.idempotencyKey, body.paymentMethodId); }
}