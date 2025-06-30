import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // Specify the path to your .env file
  }),
    // Import the AppointmentModule and DatabaseModule
    AppointmentModule,
    DatabaseModule],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
