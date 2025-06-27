import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { Document } from './document.entity';

export interface UserAttributes {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role_id: number;
}

@Table({
  tableName: 'users',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class User extends Model<UserAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare role_id: number;

  @BelongsTo(() => Role)
  declare role: Role;

  @HasMany(() => Document)
  declare documents: Document[];
}
