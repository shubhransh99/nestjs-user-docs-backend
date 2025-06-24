import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, context }) => {
  const coloredContext = chalk.cyan(`[${context || 'App'}]`);
  return `${chalk.gray(timestamp)} ${coloredContext} ${chalk.yellow(level)}: ${message}`;
});

export const logger = createLogger({
  level: 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({
      filename: 'logs/app.log',
      level: 'info',
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});
