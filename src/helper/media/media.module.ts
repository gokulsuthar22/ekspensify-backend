import { Module } from '@nestjs/common';
import { AwsS3Service } from './services/aws-s3.service';
import { ImageResizerService } from './services/Image-resizer.service';
import { MediaRepository } from './media.repository';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  providers: [
    MediaRepository,
    AwsS3Service,
    CloudinaryService,
    ImageResizerService,
  ],
  exports: [MediaRepository, AwsS3Service, CloudinaryService],
})
export class MediaModule {}
