import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as NestLogger } from '@nestjs/common';
import { logger } from './shared/logger';
import { Env } from './shared/env';
import chalk from 'chalk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: {
      log: (msg) => logger.info(msg),
      error: (msg) => logger.error(msg),
      warn: (msg) => logger.warn(msg),
      debug: (msg) => logger.debug(msg),
      verbose: (msg) => logger.verbose(msg),
    },
  });
  await app.listen(Env.PORT);
  logger.info(chalk.greenBright(`🚀 App running on port ${Env.PORT}`), {
    context: 'Bootstrap',
  });
}
bootstrap();
