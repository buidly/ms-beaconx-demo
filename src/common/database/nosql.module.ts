import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Config from 'config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot(Config.mongo.url),
  ],
  exports: [],
})
export class NoSQLDatabaseModule { }
