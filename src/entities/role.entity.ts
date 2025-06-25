import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';


@Table({
  tableName: 'roles',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class Role extends Model<Role> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  role_id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @HasMany(() => User)
  users: User[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[];
}
