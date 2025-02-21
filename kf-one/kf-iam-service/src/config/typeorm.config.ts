import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserVerification } from '../user-verification/user-verification.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [UserVerification],
  synchronize: true, // Set to false in production
};
