import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImageDataProvider {
  public async getImage(url: string): Promise<Buffer> {
    const axiosResponse = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(axiosResponse.data, 'binary');
  }
}
