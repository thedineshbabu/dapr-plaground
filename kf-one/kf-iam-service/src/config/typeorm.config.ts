import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserVerification } from '../user-verification/user-verification.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
  entities: [UserVerification],
  synchronize: true, // Set to false in production
};
