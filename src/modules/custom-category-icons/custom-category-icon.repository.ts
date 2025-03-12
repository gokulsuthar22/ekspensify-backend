import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCustomCategoryIconData,
  CustomCategoryIconWhere,
  FilterCustomCategoryIconWhere,
  UpdateCustomCategoryIconData,
} from './custom-category-icon.interface';
import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CUSTOM_CATEGORY_ICON_CACHE_KEY } from './custom-category-icon.constants';

@Injectable()
export class CustomCategoryIconRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
  ) {}

  private get CustomCategoryIcon() {
    return this.prismaService.customCategoryIcon;
  }

  private select = {
    id: true,
    iconId: true,
    isActive: true,
    icFillColor: true,
    icon: {
      select: {
        path: true,
      },
    },
  };

  async create(data: CreateCustomCategoryIconData) {
    const categoryIcon = await this.CustomCategoryIcon.create({
      data,
      select: this.select,
    });
    await this.cacheManager.del(CUSTOM_CATEGORY_ICON_CACHE_KEY);
    return categoryIcon;
  }

  async findById(id: number) {
    const categoryIcon = await this.CustomCategoryIcon.findUnique({
      where: { id },
      select: this.select,
    });
    return categoryIcon;
  }

  async findByIdAndUpdate(id: number, data: UpdateCustomCategoryIconData) {
    const categoryIcon = await this.CustomCategoryIcon.update({
      where: { id },
      data,
      select: this.select,
    });
    await this.cacheManager.del(CUSTOM_CATEGORY_ICON_CACHE_KEY);
    return categoryIcon;
  }

  async findByIdAndDelete(id: number) {
    const category = await this.CustomCategoryIcon.delete({
      where: { id },
      select: this.select,
    });
    await this.cacheManager.del(CUSTOM_CATEGORY_ICON_CACHE_KEY);
    return category;
  }

  async findOne(where: CustomCategoryIconWhere) {
    const category = await this.CustomCategoryIcon.findFirst({
      where,
      select: this.select,
    });
    return category;
  }

  async findMany(where?: FilterCustomCategoryIconWhere) {
    const categoryIcons = await this.CustomCategoryIcon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: this.select,
    });
    return categoryIcons;
  }
}
