import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../../user/user.service';

export type JwtPayload = {
  email: string;
  sub: string;
};

const cookieExtractor = (req: Request) => {
  let token = null;

  if (req && req.signedCookies) {
    token = req.signedCookies['mixerai_access_token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    console.log("Attempting to verify user's JWT token...", payload);
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Please log in to continue.');
    }

    return {
      email: user.email,
      sub: user.id,
    };
  }
}
