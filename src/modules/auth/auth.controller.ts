import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { GoogleAuthService } from './services/google-auth.service';
import { AuthService } from './auth.service';
import { UserDto } from '@/shared/user/dtos/user.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { OtpService } from '@/shared/otp/otp.service';
import { SendOtpDto } from './dtos/send-otp.dto';
import { EmailSignUpDto } from './dtos/email-signup.dto';
import { EmailSignInDto } from './dtos/email-signin.dto';
import { GoogleSignUpDto } from './dtos/google-signup.dto';
import { GoogleSignInDto } from './dtos/google-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private googleAuthService: GoogleAuthService,
    private authService: AuthService,
    private otpService: OtpService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  sendOtp(@Body() data: SendOtpDto) {
    // return this.otpService.send(data.email, data.name);
    return this.otpService.send(data.email);
  }

  @HttpCode(HttpStatus.CREATED)
  @Serialize(UserDto)
  @Post('signup')
  emailSiginUp(@Body() data: EmailSignUpDto) {
    return this.authService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Serialize(AuthResponseDto)
  @Post('signin')
  emailSiginIn(@Body() data: EmailSignInDto) {
    return this.authService.signIn(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Serialize(AuthResponseDto)
  @Post('google-signup')
  googleSiginUp(@Body() data: GoogleSignUpDto) {
    return this.googleAuthService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Serialize(AuthResponseDto)
  @Post('google-signin')
  googleSiginIn(@Body() data: GoogleSignInDto) {
    return this.googleAuthService.signIn(data);
  }
}
