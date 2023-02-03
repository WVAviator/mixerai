import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthSessionService } from '../auth-session/auth-session.service';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { JwtPayload } from './strategies/jwt/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private authSessionService: AuthSessionService,
  ) {}

  /**
   * Generates a JWT for a user given their one-time-use auth session id.
   * @param user The user passed in from Passport authentication.
   * @returns A JWT token that should be set on the response cookies.
   */
  async login({ auid }: LoginDto) {
    const authSession = await this.authSessionService.retrieveAndValidate(auid);
    const user = await this.userService.findOneById(authSession.userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    this.logger.log(`Signing in user: ${user.email}`);
    const token = this.generateJwt({
      email: user.email,
      sub: user.id,
    });

    return { userData: user, token };
  }

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
