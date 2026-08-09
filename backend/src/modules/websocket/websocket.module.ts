import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({ imports: [JwtModule.registerAsync({ imports:[ConfigModule],inject:[ConfigService],useFactory:(c:ConfigService)=>({secret:c.get('JWT_SECRET')}) })], providers:[WebsocketGateway], exports:[WebsocketGateway] })
export class WebsocketModule {}