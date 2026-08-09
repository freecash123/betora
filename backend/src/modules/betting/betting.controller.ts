import { Controller, Get, Post, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { BettingService } from './betting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlaceBetDto } from './dto';

@Controller('betting')
@UseGuards(JwtAuthGuard)
export class BettingController {
  constructor(private readonly bettingService: BettingService) {}

  @Post('place') async placeBet(@Req() req, @Body() dto: PlaceBetDto) { return this.bettingService.placeBet(req.user.id, dto, req.ip); }
  @Get('bets') async getBets(@Req() req, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) { return this.bettingService.getBets(req.user.id, status, page||1, limit||20); }
  @Get('bets/:id') async getBet(@Req() req, @Param('id') id: string) { return this.bettingService.getBet(req.user.id, id); }
  @Get('bets/ref/:ref') async getBetByRef(@Param('ref') ref: string) { return this.bettingService.getBetByRef(ref); }
  @Post('cash-out/:id') async cashOut(@Req() req, @Param('id') id: string) { return this.bettingService.cashOut(req.user.id, id); }
  @Get('cash-out/:id/offer') async getCashOutOffer(@Req() req, @Param('id') id: string) { return this.bettingService.getCashOutOffer(req.user.id, id); }
}