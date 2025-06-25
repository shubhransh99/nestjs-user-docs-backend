import {
  //   ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-auth-guard') {
  //   canActivate(context: ExecutionContext) {
  //     console.log('🚨 JwtAuthGuard activated');
  //     return super.canActivate(context);
  //   }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.log('❌ JWT validation failed:', { err, info });
      throw new UnauthorizedException('Invalid or missing token');
    }

    return user;
  }
}
