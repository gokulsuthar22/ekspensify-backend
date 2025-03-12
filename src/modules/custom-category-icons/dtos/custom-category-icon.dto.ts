import { Expose, Transform } from 'class-transformer';

export class CustomCategoryIconDto {
  @Expose()
  id: number;

  @Expose({ name: 'isActive' })
  is_active: number;

  @Expose({ name: 'iconId' })
  icon_id: number;

  @Expose({ name: 'icFillColor' })
  ic_fill_color?: string;

  @Expose()
  @Transform(({ obj }) => obj?.icon?.path)
  path: string;
}
