import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateMediaData,
  FilterMediaWhere,
  MediaWhere,
  UpdateMediaData,
} from './media.interface';

@Injectable()
export class MediaRepository {
  constructor(private prismaService: PrismaService) {}

  private get Media() {
    return this.prismaService.media;
  }

  private select = {
    id: true,
    path: true,
    entityId: true,
    entityType: true,
  };

  async create(data: CreateMediaData) {
    const media = await this.Media.create({
      data,
      select: this.select,
    });
    return media;
  }

  async findById(id: number) {
    const media = await this.Media.findUnique({
      where: { id },
      select: this.select,
    });
    return media;
  }

  async findByIdAndUpdate(id: number, data: UpdateMediaData) {
    const media = await this.Media.update({
      where: { id },
      data,
      select: this.select,
    });
    return media;
  }

  async findByIdAndDelete(id: number) {
    const media = await this.Media.delete({
      where: { id },
      select: this.select,
    });
    return media;
  }

  async findOne(where: MediaWhere) {
    const media = await this.Media.findFirst({ where, select: this.select });
    return media;
  }

  async findOneAndUpdate(
    where: Prisma.MediaWhereUniqueInput,
    data: Prisma.MediaUpdateInput,
  ) {
    const media = await this.Media.update({ where, data, select: this.select });
    return media;
  }

  async findOneAndDelete(where: Prisma.MediaWhereUniqueInput) {
    const media = await this.Media.delete({ where, select: this.select });
    return media;
  }

  async findMany(where?: FilterMediaWhere) {
    const media = await this.Media.findMany({ where, select: this.select });
    return media;
  }
}
