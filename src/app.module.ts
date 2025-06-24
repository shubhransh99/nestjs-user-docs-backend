import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequelize.config';
import { entities } from './entities';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    SequelizeModule.forFeature(entities), // allow injection of models
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
  ],
})
export class AppModule {}
