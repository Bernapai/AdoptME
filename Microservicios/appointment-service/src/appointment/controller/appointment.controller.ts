import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto } from '../dto/createAppointment.dto';
import { UpdateAppointmentDto } from '../dto/updateAppointment.dto';
import { Appointment } from '../entities/appointment.entity';

@Controller()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @MessagePattern({ cmd: 'create-appointment' })
  async create(
    @Payload() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(createAppointmentDto);
  }

  @MessagePattern({ cmd: 'get-appointments' })
  async findAll(): Promise<Appointment[]> {
    return this.appointmentService.findAll();
  }

  @MessagePattern({ cmd: 'get-appointment' })
  async findOne(@Payload() id: number): Promise<Appointment> {
    return this.appointmentService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-appointment' })
  async update(
    @Payload() payload: { id: number; dto: UpdateAppointmentDto },
  ): Promise<Appointment> {
    return this.appointmentService.update(payload.id, payload.dto);
  }

  @MessagePattern({ cmd: 'delete-appointment' })
  async remove(@Payload() id: number): Promise<void> {
    return this.appointmentService.remove(id);
  }
}
