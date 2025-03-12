import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginationService } from '@/common/services/pagination.service';
import { PaginationParams } from '@/common/types/pagination.type';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

  private get User() {
    return this.prismaService.user;
  }

  async create(data: Prisma.UserCreateInput, include?: Prisma.UserInclude) {
    try {
      const user = await this.User.create({ data, include });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppHttpException(
          HttpStatus.CONFLICT,
          'This email is already associated with an account. Please sign in instead.',
        );
      }
      throw error;
    }
  }

  async findById(id: number, include?: Prisma.UserInclude) {
    const user = await this.User.findUnique({ where: { id }, include });
    return user;
  }

  async findByIdAndUpdate(
    id: number,
    data: Prisma.UserUpdateInput,
    include?: Prisma.UserInclude,
  ) {
    const user = await this.User.update({ where: { id }, data, include });
    return user;
  }

  async findByIdAndDelete(id: number, include?: Prisma.UserInclude) {
    const user = await this.User.delete({ where: { id }, include });
    return user;
  }

  async findOne(where: Prisma.UserWhereInput, include?: Prisma.UserInclude) {
    const user = await this.User.findFirst({ where, include });
    return user;
  }

  async findOneAndUpdate(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    include?: Prisma.UserInclude,
  ) {
    const user = await this.User.update({ where, data, include });
    return user;
  }

  async findOneAndDelete(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
  ) {
    const user = await this.User.delete({ where, include });
    return user;
  }

  async findMany(where?: PaginationParams) {
    const user = await this.paginationService.paginate<User>(this.User, {
      where,
    });
    return user;
  }
}
