import { Expose } from 'class-transformer';

export class MediaDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  path: string;

  @Expose()
  mime: string;

  @Expose()
  type: string;

  @Expose()
  size: number;

  @Expose()
  collection: string;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
