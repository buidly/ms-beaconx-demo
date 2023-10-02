import { Module } from '@nestjs/common';
import Config from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../endpoints/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: Config.postgres.url,
      entities: [User],
      // synchronize: true, // should NOT be used in production!
    }),
  ],
  exports: [],
})
export class SQLDatabaseModule { }
