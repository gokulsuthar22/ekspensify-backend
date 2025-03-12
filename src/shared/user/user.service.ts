import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/common/types/pagination.type';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async findById(id: number) {
    const user = await this.userRepo.findById(id, {
      _count: { select: { accounts: true } },
    });
    if (!user) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  async updateById(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.userRepo.findByIdAndUpdate(id, data);
    if (!user) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  async deleteById(id: number) {
    const user = await this.userRepo.findByIdAndDelete(id);
    if (!user) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  async findMany(where?: PaginationParams) {
    const users = await this.userRepo.findMany(where);
    return users;
  }
}
