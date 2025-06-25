import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as NestLogger } from '@nestjs/common';
import { logger } from './shared/logger';
import { Env } from './shared/env';
import chalk from 'chalk';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './shared/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: {
      log: (msg) => logger.info(msg),
      error: (err) => {
        if (err instanceof Error) {
          logger.error(err.message, { stack: err.stack });
        } else if (typeof err === 'string') {
          logger.error(err);
        } else {
          logger.error(JSON.stringify(err, null, 2));
        }
      },
      warn: (msg) => logger.warn(msg),
      debug: (msg) => logger.debug(msg),
      verbose: (msg) => logger.verbose(msg),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unexpected properties
      forbidNonWhitelisted: true, // throws error on extra props
      transform: true, // transforms payloads to DTO classes
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app); // ✅ Hook in here

  await app.listen(Env.PORT);
  logger.info(chalk.greenBright(`🚀 App running on port ${Env.PORT}`), {
    context: 'Bootstrap',
  });
}
bootstrap();
