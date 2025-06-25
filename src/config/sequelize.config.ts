import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Env } from '../shared/env';
import { entities } from '../entities';
import { logger } from 'src/shared/logger';

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
  // logging: (msg) => logger.debug(msg, { context: 'Sequelize' }),
  logging: false,
};
