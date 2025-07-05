import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateAppointmentDto } from '../../../Microservicios/appointment-service/src/appointment/dto/createAppointment.dto';
import { UpdateAppointmentDto } from '../../../Microservicios/appointment-service/src/appointment/dto/updateAppointment.dto';
import { Appointment } from '../../../Microservicios/appointment-service/src/appointment/entities/appointment.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENTS_SERVICE') private readonly client: ClientProxy,
  ) { }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return firstValueFrom(
      this.client.send({ cmd: 'create-appointment' }, createAppointmentDto),
    );
  }

  async findAll(): Promise<Appointment[]> {
    return firstValueFrom(this.client.send({ cmd: 'get-appointments' }, {}));
  }

  async findOne(id: number): Promise<Appointment> {
    return firstValueFrom(this.client.send({ cmd: 'get-appointment' }, id));
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return firstValueFrom(
      this.client.send(
        { cmd: 'update-appointment' },
        { id, dto: updateAppointmentDto },
      ),
    );
  }

  async remove(id: number): Promise<void> {
    return firstValueFrom(this.client.send({ cmd: 'delete-appointment' }, id));
  }
}
