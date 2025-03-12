import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { IMAGE_RESOLUTIONS } from '../media.constants';

@Injectable()
export class ImageResizerService {
  private getFileName(
    name: string,
    label: string,
    width: number,
    height: number,
  ): string {
    return `${name}-${label}-(${width}x${height}).png`;
  }

  async resize(image: Buffer, name: string) {
    try {
      const resizedImages = await Promise.all(
        IMAGE_RESOLUTIONS.map(async ({ width, height, label }) => {
          const buffer = await sharp(image)
            .resize(width, height)
            .png({ compressionLevel: 9 })
            .toBuffer();
          return {
            buffer,
            name: this.getFileName(name, label, width, height),
          };
        }),
      );
      const [small, medium, large] = resizedImages;
      return { small, medium, large };
    } catch (error: any) {
      throw new Error(`Image resizing failed: ${error.message}`);
    }
  }
}
