import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequelize.config';
import { entities } from './entities';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    SequelizeModule.forFeature(entities), // allow injection of models
  ],
})
export class AppModule {}
