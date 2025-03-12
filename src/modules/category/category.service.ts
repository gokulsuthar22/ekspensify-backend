import { HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import {
  CreateCategoryData,
  FilterCategoryWhere,
  UpdateCategoryData,
  CategoryWhere,
  UploadIconData,
} from './category.interface';
import { AppHttpException } from '@/core/exceptions/app-http.exception';
import { MediaRepository } from '@/helper/media/media.repository';
import { AwsS3Service } from '@/helper/media/services/aws-s3.service';
import { CustomCategoryIconRepository } from '@/modules/custom-category-icons/custom-category-icon.repository';
import { UtilService } from '@/common/services/util.service';

import * as sharp from 'sharp';
import { CloudinaryService } from '@/helper/media/services/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private mediaRepo: MediaRepository,
    private customCategoryIconRepo: CustomCategoryIconRepository,
    // private cloudinaryService: CloudinaryService,
    private awsS3Service: AwsS3Service,
    private utilService: UtilService,
  ) {}

  private async validateIcon(id: number) {
    const icon = await this.mediaRepo.findById(id);
    if (!icon) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        `Icon not found`,
        'ICON_NOT_FOUND',
      );
    }
    if (icon.entityId) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'Icon belongs to another category',
      );
    }
    return icon;
  }

  private async isCustomIcon(id: number) {
    const isCustomIcon = await this.customCategoryIconRepo.findOne({
      iconId: id,
      isActive: true,
    });
    // if (!isCustomIcon) {
    //   throw new AppHttpException(
    //     HttpStatus.NOT_FOUND,
    //     `Custom Icon not found`,
    //     'CUSTOM_CATEGORY_ICON_NOT_FOUND',
    //   );
    // }
    return isCustomIcon ? true : false;
  }

  async getIcFillColor(iconPath: string) {
    const iconBuffer = await (await fetch(iconPath)).arrayBuffer();
    const iconColor = await sharp(iconBuffer)
      .ensureAlpha()
      .toColourspace('srgb')
      .resize(1, 1, { fit: 'contain' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const r = iconColor.data[0],
      g = iconColor.data[1],
      b = iconColor.data[2];
    const icFillColor = this.utilService.rgbToHex(r, g, b);
    return icFillColor;
  }

  async insights(
    userId: number,
    type: any,
    startDate: string,
    endDate: string,
  ) {
    const insights = await this.categoryRepo.insights(
      userId,
      type,
      startDate,
      endDate,
    );
    return insights;
  }

  async create(data: CreateCategoryData) {
    const icon = await this.validateIcon(data.iconId);
    if (!data.icFillColor) {
      var icFillColor = await this.getIcFillColor(icon.path);
    }
    const category = await this.categoryRepo.create({
      ...data,
      icFillColor: icFillColor || data?.icFillColor,
    });
    const isCustomIcon = await this.isCustomIcon(icon.id);
    if (!isCustomIcon) {
      await this.mediaRepo.findByIdAndUpdate(icon.id, {
        entityId: data.iconId,
        entityType: 'category',
      });
    }
    return category;
  }

  async update(where: CategoryWhere, data: UpdateCategoryData) {
    if (!data.iconId) {
      delete data?.iconId;
    }
    if (data.iconId) {
      const icon = await this.validateIcon(data.iconId);
      if (!data.icFillColor) {
        var icFillColor = await this.getIcFillColor(icon.path);
      }
      const isCustomIcon = await this.isCustomIcon(icon.id);
      if (!isCustomIcon) {
        await this.mediaRepo.findByIdAndUpdate(icon.id, {
          entityId: where.id,
          entityType: 'category',
        });
      }
    }
    const category = await this.categoryRepo.findOneAndUpdate(where, {
      ...data,
      icFillColor: icFillColor || data?.icFillColor,
    });
    if (!category) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'Category does not exist',
      );
    }
    return category;
  }

  async delete(where: CategoryWhere) {
    const category = await this.categoryRepo.findOneAndDelete(where);
    if (!category) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'Category does not exist',
      );
    }
    return category;
  }

  async findMany(where?: FilterCategoryWhere) {
    const categories = await this.categoryRepo.findMany(where);
    return categories;
  }

  async uploadIcon(data: UploadIconData) {
    // const path = await this.cloudinaryService.upload(
    //   data.icon.buffer,
    //   data.icon.mimetype,
    // );
    // const icon = this.mediaRepo.create({
    //   name: data.icon.originalname,
    //   path: path,
    //   size: data.icon.size,
    //   mime: data.icon.mimetype,
    //   userId: data.userId,
    // });
    // return icon;
    const name = this.awsS3Service.getObjectKey(
      data.icon.originalname,
      'png',
      'categories',
    );
    const path = this.awsS3Service.getObjectUrl(name);
    const [icon] = await Promise.all([
      this.mediaRepo.create({
        name: data.icon.originalname,
        path: path,
        size: data.icon.size,
        mime: data.icon.mimetype,
        userId: data.userId,
      }),
      this.awsS3Service.upload(data.icon.buffer, name, data.icon.mimetype),
    ]);
    return icon;
  }
}
