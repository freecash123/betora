import { IsString, IsNumber, Min, Max, IsArray, IsOptional, IsIn, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class BetSelectionDto {
  @IsUUID() selectionId: string;
  @IsNumber() @Min(1.01) odds: number;
}

export class PlaceBetDto {
  @IsIn(['SINGLE','MULTIPLE','SYSTEM']) type: string;
  @IsNumber() @Min(0.50) @Max(100000) stake: number;
  @IsArray() @ValidateNested({each:true}) @Type(()=>BetSelectionDto) selections: BetSelectionDto[];
  @IsOptional() @IsString() idempotencyKey?: string;
}

export class CashOutDto {
  @IsUUID() betId: string;
}