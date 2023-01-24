import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async signIn(user: User) {
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const userData = await this.userService.findOneByEmail(user.email);
    if (!userData) {
      return this.registerUser(user);
    }
    return this.generateJwt({
      email: userData.email,
      sub: userData.id,
    });
  }

  async registerUser(user: User) {
    try {
      const createdUser = await this.userService.create(user);
      return this.generateJwt({
        email: createdUser.email,
        sub: createdUser.id,
      });
    } catch {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
