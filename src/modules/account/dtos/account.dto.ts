import { Expose, Type } from 'class-transformer';

export class AccountDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  slug: string;

  @Expose()
  icon: string;

  @Expose()
  @Type(() => Number)
  balance: number;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
