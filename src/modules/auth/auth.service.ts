import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { comparePasswords } from 'src/shared/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Permission) private permissionModel: typeof Permission,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({
      where: { email },
      include: {
        model: Role,
        include: [Permission],
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions.map((p) => p.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
