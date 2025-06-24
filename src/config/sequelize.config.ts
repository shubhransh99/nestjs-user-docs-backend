import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Env } from '../shared/env';
import { entities } from '../entities';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: Env.DB.HOST,
  port: Env.DB.PORT,
  username: Env.DB.USER,
  password: Env.DB.PASSWORD,
  database: Env.DB.NAME,
  models: entities,
  autoLoadModels: false, // we explicitly register models
  synchronize: false, // use migrations instead
  logging: Env.NODE_ENV !== 'production',
};
