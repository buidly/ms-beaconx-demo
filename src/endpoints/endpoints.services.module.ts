import { Module } from '@nestjs/common';
import { ExampleModule } from './example/example.module';
import { TokenModule } from './tokens/token.module';
import { UsersModule } from './users/user.module';
import { SQLDatabaseModule } from '../common/database/sql.module';

@Module({
  imports: [
    SQLDatabaseModule,
    ExampleModule,
    TokenModule,
    UsersModule,
  ],
  exports: [
    ExampleModule,
    TokenModule,
    UsersModule,
  ],
})
export class EndpointsServicesModule { }
