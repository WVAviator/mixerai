import {
  androidpublisher,
  androidpublisher_v3,
} from '@googleapis/androidpublisher';
import { Injectable } from '@nestjs/common';

interface GetPurchaseOptions {
  packageName: string;
  productId: string;
  purchaseToken: string;
}

@Injectable()
export class AndroidPublisherProvider {
  private androidPublisher: androidpublisher_v3.Androidpublisher;

  constructor() {
    this.androidPublisher = androidpublisher({
      version: 'v3',
      auth: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async getPurchase({
    packageName,
    productId,
    purchaseToken,
  }: GetPurchaseOptions) {
    const response = await this.androidPublisher.purchases.products.get({
      packageName,
      productId,
      token: purchaseToken,
    });

    return response.data;
  }
}
