import { Module } from '@nestjs/common';
import { SportsbookController } from './sportsbook.controller';
import { SportsbookService } from './sportsbook.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [SportsbookController], providers: [SportsbookService], exports: [SportsbookService] })
export class SportsbookModule {}