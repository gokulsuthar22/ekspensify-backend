import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UtilService } from '@/common/services/util.service';

@Injectable()
export class OtpRepository {
  constructor(
    private prismaService: PrismaService,
    private utilService: UtilService,
  ) {}

  private get Otp() {
    return this.prismaService.otp;
  }

  async create(data: Pick<Prisma.OtpCreateInput, 'email'>) {
    const code = this.utilService.generateRandomCode(6);
    const expiresAt = this.utilService.addMinutes(10).toDate();
    return this.Otp.upsert({
      create: { email: data.email, code, expiresAt, isVerified: false },
      where: { email: data.email },
      update: { email: data.email, code, expiresAt, isVerified: false },
    });
  }

  async findById(id: number) {
    return this.Otp.findUnique({ where: { id } });
  }

  async findByIdAndUpdate(
    id: number,
    data: Pick<Prisma.OtpUpdateInput, 'isVerified' | 'expiresAt' | 'code'>,
  ) {
    return this.Otp.update({ where: { id }, data });
  }

  async findByIdAndDelete(id: number) {
    try {
      return await this.Otp.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOne(where: Prisma.OtpWhereInput) {
    return this.Otp.findFirst({ where });
  }

  async findOneAndUpdate(
    where: Prisma.OtpWhereUniqueInput,
    data: Pick<Prisma.OtpUpdateInput, 'isVerified' | 'expiresAt' | 'code'>,
  ) {
    return this.Otp.update({ where, data });
  }

  async findOneAndDelete(where: Prisma.OtpWhereUniqueInput) {
    return await this.Otp.delete({ where });
  }

  async findMany(where?: Prisma.OtpWhereInput) {
    return this.Otp.findMany({ where });
  }
}
