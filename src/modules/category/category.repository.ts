import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { UtilService } from '@/common/services/util.service';
import {
  CategoryWhere,
  CreateCategoryData,
  FilterCategoryWhere,
  GenerateCategorySlug,
  UpdateCategoryData,
} from './category.interface';
import { Repository } from '@/common/types/repository.interface';
import { Category } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CATEGORY_CACHE_KEY } from './category.constants';

@Injectable()
export class CategoryRepository
  implements
    Repository<Category, CreateCategoryData, UpdateCategoryData, CategoryWhere>
{
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
    private utilService: UtilService,
  ) {}

  private get Category() {
    return this.prismaService.category;
  }

  private include = {
    icon: {
      select: {
        path: true,
      },
    },
  };

  private generateSlug(category: GenerateCategorySlug) {
    return this.utilService.slugifyText(
      category.name,
      category?.type,
      category?.userId?.toString(),
    );
  }

  private async updateSlug(id: number, slug: string) {
    const category = await this.Category.update({
      where: { id },
      data: { slug },
      include: this.include,
    });
    return category;
  }

  async create(data: CreateCategoryData) {
    const slug = this.generateSlug(data);
    const category = await this.Category.create({
      data: { ...data, slug },
      include: this.include,
    });
    await this.cacheManager.del(CATEGORY_CACHE_KEY);
    return category;
  }

  async findById(id: number) {
    const category = await this.Category.findUnique({
      where: { id },
      include: this.include,
    });
    return category;
  }

  async findByIdAndUpdate(id: number, data: UpdateCategoryData) {
    let category = await this.Category.update({
      where: { id },
      data,
      include: this.include,
    });
    if (data.name || data.type) {
      const slug = this.generateSlug(category);
      category = await this.updateSlug(category.id, slug);
    }
    await this.cacheManager.del(CATEGORY_CACHE_KEY);
    return category;
  }

  async findByIdAndDelete(id: number) {
    const category = await this.Category.delete({
      where: { id },
      include: this.include,
    });
    await this.cacheManager.del(CATEGORY_CACHE_KEY);
    return category;
  }

  async findOne(where: CategoryWhere) {
    const category = await this.Category.findFirst({
      where,
      include: this.include,
    });
    return category;
  }

  async findOneAndUpdate(where: CategoryWhere, data?: UpdateCategoryData) {
    let category = await this.Category.update({
      where,
      data,
      include: this.include,
    });
    if (data.name || data.type) {
      const slug = this.generateSlug(category);
      category = await this.updateSlug(category.id, slug);
    }
    await this.cacheManager.del(CATEGORY_CACHE_KEY);
    return category;
  }

  async findOneAndDelete(where: CategoryWhere) {
    const category = await this.Category.delete({
      where,
      include: this.include,
    });
    await this.cacheManager.del(CATEGORY_CACHE_KEY);
    return category;
  }

  async findMany(where?: FilterCategoryWhere) {
    const categories = await this.Category.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: this.include,
    });
    return categories;
  }

  async insights(
    userId: number,
    type: 'CREDIT' | 'DEBIT',
    startDate: string,
    endDate: string,
  ) {
    const result = await this.prismaService.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        deletedAt: null,
        type,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const enrichedResult = await Promise.all(
      result.map(async (item) => {
        const category = await this.prismaService.category.findUnique({
          where: { id: item.categoryId },
          select: {
            id: true,
            name: true,
            icon: {
              select: { path: true },
            },
            icFillColor: true,
          },
        });

        return {
          category: {
            id: category?.id,
            name: category?.name,
            icon: { path: category?.icon?.path },
            icFillColor: category?.icFillColor,
          },
          amount: +item._sum.amount,
        };
      }),
    );

    return enrichedResult;
  }
}
