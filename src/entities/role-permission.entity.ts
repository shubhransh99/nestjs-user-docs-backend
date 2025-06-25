import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Table({
  tableName: 'role_permissions',
  timestamps: true,
  underscored: true,
})
export class RolePermission extends Model<RolePermission> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare role_permission_id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  declare role_id: number;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.INTEGER })
  declare permission_id: number;
}
