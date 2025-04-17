import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AppointmentModule, DatabaseModule],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
