import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '@/common/services/util.service';
import * as crypto from 'crypto';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3Client;

  private readonly bucket = this.configService.get('s3').bucket;
  private readonly region = this.configService.get('s3').region;
  private readonly accessKey = this.configService.get('s3').accessKey;
  private readonly secretKey = this.configService.get('s3').secretAccessKey;

  constructor(
    private configService: ConfigService,
    private utilService: UtilService,
  ) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
      region: this.region,
    });
  }

  public getObjectKey(name: string, ext: string, dir?: string) {
    const hash = crypto
      .createHash('md5')
      .update(name)
      .digest('hex')
      .slice(0, 12);
    const fileName = `${this.utilService.slugifyText(name)}-${hash}.${ext}`;
    return dir ? `${dir}/${fileName}` : fileName;
  }

  public getObjectUrl(key: string) {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  public async upload(buffer: Buffer, fileName: string, contentType: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return this.getObjectUrl(fileName);
  }

  public async remove(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    return this.getObjectUrl(key);
  }
}
