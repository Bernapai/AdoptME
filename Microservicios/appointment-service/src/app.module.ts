import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './database/cache.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // Specify the path to your .env file
  }),
    // Import the AppointmentModule and DatabaseModule
    AppointmentModule,
    DatabaseModule,
    RedisCacheModule
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
