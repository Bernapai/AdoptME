import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [UsersModule, DatabaseModule],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
