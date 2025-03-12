import { Expose } from 'class-transformer';

export class UploadIconResponseDto {
  @Expose({ name: 'id' })
  icon_id: number;

  @Expose()
  path: string;
}
