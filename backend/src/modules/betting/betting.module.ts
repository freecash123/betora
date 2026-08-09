import { Module } from '@nestjs/common';
import { BettingController } from './betting.controller';
import { BettingService } from './betting.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({ imports: [PrismaModule, WalletsModule], controllers: [BettingController], providers: [BettingService], exports: [BettingService] })
export class BettingModule {}