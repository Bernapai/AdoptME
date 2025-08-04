import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheModule } from './database/cache.module';


@Module({

  imports: [UsersModule,
    DatabaseModule,
    RedisCacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    })],

})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
