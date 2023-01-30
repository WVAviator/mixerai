import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { randomBytes } from 'crypto';

@Injectable()
export class S3Provider {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  public async uploadImage(image: Buffer): Promise<string> {
    const key = randomBytes(16).toString('hex');
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: image,
      ContentType: 'image/png',
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }
}
