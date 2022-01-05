import dotenv from 'dotenv';
import User from './db/entities/User';
import Profile from './db/entities/Profile';

dotenv.config();

export interface Config {
  port: number;
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    type: 'mysql' | 'postgres' | 'sqlite' | 'mariadb';
    dbEntitiesPath: any[];
    migrationsPath: string[];
  };
  jwt: {
    secret: string;
  };
  isDevMode: boolean;
}

const isDevMode = process.env.NODE_ENV === 'development';

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'my-db',
    type: 'mysql',
    dbEntitiesPath: [
      User,
      Profile,
    ],
    migrationsPath: [
      ... isDevMode ? [__dirname + '/db/migrations/**/*.ts'] : [__dirname + '/../dist/db/migrations/**/*.js'],
    ],
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt-secret',
  },
  isDevMode,
};

export default config;
