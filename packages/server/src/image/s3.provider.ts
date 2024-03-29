import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { randomBytes } from 'crypto';

/**
 * Provides an interface to upload images to S3.
 */
@Injectable()
export class S3Provider {
  private readonly s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_REGION'),
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
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
      Body: image,
      ContentType: type,
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }

  /**
   * Extracts the key from the image URL and sends a delete request to S3.
   * @param url The url of the image to delete
   */
  public async deleteImage(key: string): Promise<void> {
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }
}
