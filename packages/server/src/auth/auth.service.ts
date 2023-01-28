import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { JwtPayload } from './strategies/jwt/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * Generates a JWT for a user. If the user does not already exist in the database, they will be registered and added to the database.
   * @param user The user passed in from Passport authentication.
   * @returns A JWT token that should be set on the response cookies.
   */
  async signIn(user: User) {
    if (!user) {
      this.logger.error(
        'User missing from request. User should be provided by Passport authentication.',
      );
      throw new BadRequestException(
        'An error occurred during authentication process.',
      );
    }
    this.logger.log(`Signing in user: ${user.email}`);
    const userData = await this.userService.findOneByEmail(user.email);
    if (!userData) {
      this.logger.log(`User not found. Creating user: ${user.email}`);
      return this.registerUser(user);
    }
    this.logger.log(`User found: ${userData.email}. Generating JWT.`);
    return this.generateJwt({
      email: userData.email,
      sub: userData.id,
    });
  }

  /**
   * Registers a new user by first creating a new user in the database and then generating a JWT.
   * @param user The user profile passed in from Passport authentication.
   * @returns A JWT token that should be set on the response cookies.
   */
  async registerUser(user: User) {
    try {
      this.logger.log(`Creating user ${user.email} in database.`);
      const createdUser = await this.userService.create(user);
      this.logger.log(`User created: ${createdUser.email}. Generating JWT.`);
      return this.generateJwt({
        email: createdUser.email,
        sub: createdUser.id,
      });
    } catch (error) {
      this.logger.error(`An error occurred during user registration: ${error}`);
      throw new InternalServerErrorException(
        'An error occurred during authentication process.',
      );
    }
  }

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
