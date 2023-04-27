import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { InAppPurchaseState } from '../dtos/purchase.dto';

export type PurchaseDocument = HydratedDocument<Purchase>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Purchase {
  @Prop()
  acknowledged: boolean;

  @Prop()
  productId: string;

  @Prop({ enum: InAppPurchaseState })
  purchaseState: InAppPurchaseState;

  @Prop()
  purchaseTime: number;

  @Prop({ unique: true })
  orderId: string;

  @Prop()
  packageName?: string;

  @Prop()
  purchaseToken?: string;

  @Prop()
  originalOrderId?: string;

  @Prop()
  originalPurchaseTime?: string;

  @Prop()
  transactionReceipt?: string;
}

const PurchaseSchema = SchemaFactory.createForClass(Purchase);

PurchaseSchema.virtual('id').get(function (this: PurchaseDocument) {
  return this._id.toString();
});

export { PurchaseSchema };
