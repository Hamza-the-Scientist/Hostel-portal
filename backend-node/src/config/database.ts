import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'SindhDormitoryDb',
  entities: [path.join(__dirname, '..', 'entities', '*.{ts,js}')],
  synchronize: false,  // Set to false to use existing database schema without table recreation conflicts
  logging: false,
  charset: 'utf8mb4',
});
