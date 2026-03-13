import { AppConfig } from './config.interface';

export default (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASSWORD || 'Pass',
    name: process.env.DB_NAME || 'social_app',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
});
