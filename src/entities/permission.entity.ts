import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';

@Table({
  tableName: 'permissions',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class Permission extends Model<Permission> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  permission_id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string; // e.g. 'user.create'

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[];
}
