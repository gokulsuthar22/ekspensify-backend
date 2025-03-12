import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/shared/user/user.module';
import { OtpModule } from '@/shared/otp/otp.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthService } from './services/google-auth.service';

@Module({
  imports: [ConfigModule, UserModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService],
})
export class AuthModule {}
