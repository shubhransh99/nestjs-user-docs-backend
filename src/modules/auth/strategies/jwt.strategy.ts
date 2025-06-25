import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/shared/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-auth-guard') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Env.JWT.SECRET,
      passReqToCallback: true, // ✅ enables access to full request
    });
  }

  validate(req: any, payload: any) {
    return payload;
  }
}
