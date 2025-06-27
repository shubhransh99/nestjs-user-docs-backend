import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';

export interface DocumentAttributes {
  document_id: number;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  created_by: number;
}

@Table({
  tableName: 'documents',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class Document extends Model<DocumentAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare document_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare file_url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare file_type: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare created_by: number;

  @BelongsTo(() => User)
  declare creator: User;
}
