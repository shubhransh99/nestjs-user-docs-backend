// src/entities/index.ts
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

export const entities = [User, Role, Permission, RolePermission];

export { User };
