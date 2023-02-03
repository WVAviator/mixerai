import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../../../user/user.service';
import { JwtPayload } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private userService: UserService) {
    const cookieExtractor = (req: Request) => {
      this.logger.log('Extracting JWT from cookie...');
      const token = req?.signedCookies?.['mixerai_access_token'];
      if (!token) {
        this.logger.error(
          'Attempt to access protected route failed - no JWT in signed cookies.',
        );
        throw new UnauthorizedException('Please log in to continue.');
      }
      return token;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * The validate function is invoked on any subsequent requests to protected routes.
   * @param payload The payload object that was signed and sent in the JWT.
   * @returns The user object that will be assigned to req.user.
   */
  async validate(payload: JwtPayload) {
    this.logger.log(`Validating JWT payload: ${JSON.stringify(payload)}`);
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      this.logger.error(`User with id: ${payload.sub} not found.`);
      throw new UnauthorizedException('Please log in to continue.');
    }
    this.logger.log(`User authenticated: ${user.email}`);

    return user;
  }
}
