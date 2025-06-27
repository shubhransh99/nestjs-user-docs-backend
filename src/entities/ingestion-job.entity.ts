import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Document } from './document.entity';
import { User } from './user.entity';

export enum IngestionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum IngestionTriggerType {
  MANUAL = 'manual',
  WEBHOOK = 'webhook',
}

export interface IngestionJobAttributes {
  id: number;
  status: IngestionStatus;
  document_id: number;
  triggered_by?: number | null;
  trigger_type: IngestionTriggerType;
  log?: string;
  started_at?: Date;
  completed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

@Table({
  tableName: 'ingestion_jobs',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class IngestionJob extends Model<IngestionJobAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.ENUM(...Object.values(IngestionStatus)),
    allowNull: false,
    defaultValue: IngestionStatus.PENDING,
  })
  declare status: IngestionStatus;

  @ForeignKey(() => Document)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare document_id: number;

  @BelongsTo(() => Document)
  declare document: Document;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare triggered_by: number | null;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.ENUM(...Object.values(IngestionTriggerType)),
    allowNull: false,
  })
  declare trigger_type: IngestionTriggerType;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare log: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare started_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare completed_at: Date;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}
