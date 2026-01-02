import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CommentEntity } from '../comments/comment.entity';

const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

requiredEnv.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable ${variable}`);
  }
});

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  autoLoadEntities: true,
  entities: [CommentEntity],
};
