import { Expose, Transform, Type } from 'class-transformer';

export class TransactionDto {
  @Expose()
  id: number;

  @Expose()
  account: any;

  @Expose()
  @Transform(({ obj }) => {
    return {
      id: obj?.category?.id,
      name: obj?.category?.name,
      icon: obj?.category?.icon?.path,
      ic_fill_color: obj?.category?.icFillColor,
    };
  })
  category: any;

  @Expose()
  @Transform(({ obj }) => obj?.attachment?.path)
  attachment: string;

  @Expose()
  @Type(() => Number)
  amount: number;

  @Expose()
  note: string;

  @Expose()
  type: string;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
