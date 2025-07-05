import { Module } from '@nestjs/common';
import { AppointmentController } from './controller/appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]), // Import the Appointment entity
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule { }
