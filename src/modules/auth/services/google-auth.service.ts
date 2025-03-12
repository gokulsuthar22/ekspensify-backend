import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleSignIn, GoogleSignUp } from '../auth.interface';
import { UserRepository } from 'shared/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.client = new OAuth2Client(this.configService.get('google').clientId);
  }

  private async verifyIdToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
      });
      const payload = ticket.getPayload();
      return { email: payload.email, name: payload.name };
    } catch (error: any) {
      throw new AppHttpException(
        HttpStatus.UNAUTHORIZED,
        'Invalid token: ' + error.message,
      );
    }
  }

  async signUp(data: GoogleSignUp) {
    // Extract email and name by verifying the provided Google ID token
    const { email, name } = await this.verifyIdToken(data.idToken);
    // Create a new user with the extracted email and name
    const user = await this.userRepo.create(
      { email, name, isVerified: true },
      { _count: { select: { accounts: true } } },
    );
    // Generate a JWT token for the newly created user
    const token = await this.jwtService.signAsync({ sub: user.id });
    // Return the token and user details
    return { token, user };
  }

  async signIn(data: GoogleSignIn) {
    // Extract email and name by verifying the provided Google ID token
    const { email, name } = await this.verifyIdToken(data.idToken);
    // Check if a user with this email exists in the repository
    let user = await this.userRepo.findOne(
      { email },
      { _count: { select: { accounts: true } } },
    );
    // If user does not exist, throw an error
    if (!user) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'No account found with this email. Please sign up first.',
      );
    }
    // If user account is inactive, throw an error
    if (user.status === 'INACTIVE') {
      throw new AppHttpException(
        HttpStatus.FORBIDDEN,
        'Your account is currently inactive. Please contact support to reactivate it.',
      );
    }
    // If a name is provided and different from the current user's name, update the user
    if (name && user.name !== name) {
      user = await this.userRepo.findByIdAndUpdate(
        user.id,
        { name },
        { _count: { select: { accounts: true } } },
      );
    }
    // Generate a JWT token for the authenticated user
    const token = await this.jwtService.signAsync({ sub: user.id });
    // Return the token and user details
    return { token, user };
  }
}
