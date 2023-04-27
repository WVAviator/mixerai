import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum InAppPurchaseState {
  PURCHASING = 0,
  PURCHASED = 1,
  FAILED = 2,
  RESTORED = 3,
  DEFERRED = 4,
}

export class PurchaseDto {
  @IsBoolean()
  @IsNotEmpty()
  acknowledged: boolean;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsEnum(InAppPurchaseState)
  @IsNotEmpty()
  purchaseState: InAppPurchaseState;

  @IsNumber()
  @IsNotEmpty()
  purchaseTime: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsOptional()
  packageName?: string;

  @IsString()
  @IsOptional()
  purchaseToken?: string;

  @IsString()
  @IsOptional()
  originalOrderId?: string;

  @IsString()
  @IsOptional()
  originalPurchaseTime?: string;

  @IsString()
  @IsOptional()
  transactionReceipt?: string;
}
