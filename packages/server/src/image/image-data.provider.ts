import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Provides methods for retrieving image data from a remote url
 */
@Injectable()
export class ImageDataProvider {
  /**
   * Extracts the image data from a remote url and returns it as a buffer
   * @param url The url of the image
   * @returns A promise that resolves to a buffer containing the image data
   */
  public async getImage(url: string): Promise<Buffer> {
    const axiosResponse = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(axiosResponse.data, 'binary');
  }
}
