import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as crypto from 'crypto';

@Injectable()
export class CloudinaryService {
  private readonly cloudinary: typeof cloudinary = cloudinary;

  constructor(private configService: ConfigService) {
    this.cloudinary.config({
      cloud_name: this.configService.get('cloudinary').cloudName,
      api_key: this.configService.get('cloudinary').apiKey,
      api_secret: this.configService.get('cloudinary').apiSecret,
    });
  }

  async upload(buffer: Buffer, contentType: string) {
    const publicId = crypto
      .createHash('md5')
      .update(Date.now().toString())
      .digest('hex')
      .slice(0, 12);
    const res = await cloudinary.uploader.upload(
      `data:${contentType};base64,${buffer.toString('base64')}`,
      { public_id: publicId, resource_type: 'auto' },
    );
    return res.secure_url;
  }

  async remove(publicId: string) {
    const res = await cloudinary.uploader.destroy(publicId);
    return res;
  }
}
