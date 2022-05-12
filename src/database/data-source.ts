import dbOptions from '@database/ormconfig';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource(dbOptions);
