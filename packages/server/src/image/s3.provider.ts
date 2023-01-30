import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { randomBytes } from 'crypto';

/**
 * Provides an interface to upload images to S3.
 */
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

  /**
   * Given an image buffer, uploads the image to S3 and returns the URL.
   * @param image The image buffer to upload
   * @param type The image type @default 'image/png'
   * @returns A promise that resolves to the S3 URL of the uploaded image
   */
  public async uploadImage(image: Buffer, type = 'image/png'): Promise<string> {
    const key = randomBytes(16).toString('hex');
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: image,
      ContentType: type,
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }
}
