import { DataSource } from 'typeorm';
import Config from './config/configuration';
import { User } from './src/endpoints/users/entities/user.entity';
import { CreateUser1681226998333 } from './migrations/1681226998333-CreateUser';

export default new DataSource({
  type: 'postgres',
  url: Config.postgres.url,
  entities: [User],
  migrations: [CreateUser1681226998333],
});
