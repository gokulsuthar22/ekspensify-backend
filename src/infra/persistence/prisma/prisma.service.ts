import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  applySoftDeleteMiddleware,
  excludeSoftDeletedRecordsMiddleware,
  handleUpdateDeleteGracefullyMiddleware,
} from './prisma.middlewares';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Middlewares
    this.$use(applySoftDeleteMiddleware);
    this.$use(excludeSoftDeletedRecordsMiddleware);
    this.$use(handleUpdateDeleteGracefullyMiddleware);

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
