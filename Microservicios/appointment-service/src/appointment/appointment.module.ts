import { Module } from '@nestjs/common';
import { AppointmentController } from './controller/appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'src/database/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    RedisCacheModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule { }
