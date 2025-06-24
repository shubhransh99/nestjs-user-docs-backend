export const Env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: parseInt(process.env.PORT || '3000', 10),

  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '5432', 10),
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    NAME: process.env.DB_NAME || 'nestjs_backend',
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || 'supersecretkey',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  },

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
