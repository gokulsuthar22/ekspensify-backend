import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'shared/otp/otp.service';
import { UserRepository } from 'shared/user/user.repository';
import { SignIn, SignUp } from './auth.interface';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignIn) {
    // Find the user by email
    let user = await this.userRepo.findOne(
      { email: data.email },
      { _count: { select: { accounts: true } } },
    );
    // If user is not found, throw an error suggesting to sign up
    if (!user) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'No account found with this email. Please sign up first.',
      );
    }
    // Verify the OTP for the provided email
    const isValidOtp = await this.otpService.verify(data.email, +data.otp);
    // If the OTP is invalid, throw an error indicating it is incorrect or expired
    if (!isValidOtp) {
      throw new AppHttpException(
        HttpStatus.UNAUTHORIZED,
        'Incorrect OTP or has been expired',
      );
    }
    // Check if the user's account status is inactive, and throw an error if it is
    if (user.status === 'INACTIVE') {
      throw new AppHttpException(
        HttpStatus.FORBIDDEN,
        'Your account is currently inactive. Please contact support to reactivate it.',
      );
    }
    if (!user.isVerified) {
      user = await this.userRepo.findByIdAndUpdate(
        user.id,
        { isVerified: true },
        { _count: { select: { accounts: true } } },
      );
    }
    // Generate a JWT token for the authenticated user
    const token = await this.jwtService.signAsync({ sub: user.id });
    // Return the generated token along with the user details
    return { token, user };
  }

  async signUp(data: SignUp) {
    // Create a new user with the extracted email and name
    const user = await this.userRepo.create(
      {
        email: data.email,
        name: data.name,
      },
      { _count: { select: { accounts: true } } },
    );
    // Send email otp
    // await this.otpService.send(user.email, user.name);
    await this.otpService.send(user.email);
    // Return the token and user details
    return user;
  }
}
