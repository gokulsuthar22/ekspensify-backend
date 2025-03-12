import { Expose, Transform } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  type: string;

  @Expose({ name: 'icon' })
  @Transform(({ obj }) => obj?.icon?.path)
  icon?: string;

  @Expose({ name: 'icFillColor' })
  ic_fill_color?: string;

  @Expose({ name: 'userId' })
  user_id: number;

  @Expose({ name: 'isActive' })
  is_active: boolean;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
