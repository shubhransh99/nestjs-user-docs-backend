import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities';
import { Role } from 'src/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/shared/utils/password.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Role) private readonly roleModel: typeof Role,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      include: [Role],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      include: [Role],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const role = await this.roleModel.findByPk(dto.role_id);
    if (!role) throw new BadRequestException('Invalid role');

    const hashedPassword = await hashPassword(dto.password);

    const user = new this.userModel();
    user.name = dto.name;
    user.email = dto.email;
    user.password = hashedPassword;
    user.role_id = dto.role_id;

    return user.save();
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.role_id) {
      const role = await this.roleModel.findByPk(dto.role_id);
      if (!role) throw new BadRequestException('Invalid role');
    }

    if (dto.password) {
      dto.password = await hashPassword(dto.password);
    }

    user.set(dto); // sets only provided keys
    return user.save();
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
