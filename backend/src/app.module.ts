import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { SportsbookModule } from './modules/sportsbook/sportsbook.module';
import { BettingModule } from './modules/betting/betting.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { KycModule } from './modules/kyc/kyc.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RiskModule } from './modules/risk/risk.module';
import { SupportModule } from './modules/support/support.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditModule } from './modules/audit/audit.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], envFilePath: ['.env', '.env.local'] }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule], inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ throttlers: [{ ttl: config.get('THROTTLE_TTL',60000), limit: config.get('THROTTLE_LIMIT',100) }] }),
    }),
    PrismaModule, AuthModule, UsersModule, WalletsModule, SportsbookModule, BettingModule, PaymentsModule, KycModule, PromotionsModule, NotificationsModule, RiskModule, SupportModule, AdminModule, AuditModule, WebsocketModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}