import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
@Module({

  imports: [UsersModule, DatabaseModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],

})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
