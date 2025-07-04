// src/entities/index.ts
import { Document } from './document.entity';
import { IngestionJob } from './ingestion-job.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

export const entities = [
  User,
  Role,
  Permission,
  RolePermission,
  Document,
  IngestionJob,
];

export { User };
