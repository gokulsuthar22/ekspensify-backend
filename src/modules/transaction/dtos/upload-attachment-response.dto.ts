import { Expose } from 'class-transformer';

export class UploadAttachmentResponseDto {
  @Expose({ name: 'id' })
  attachment_id: number;

  @Expose()
  path: string;
}
