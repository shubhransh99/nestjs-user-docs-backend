import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Env } from 'src/shared/env';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      secret: Env.JWT.SECRET,
      signOptions: { expiresIn: Env.JWT.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
