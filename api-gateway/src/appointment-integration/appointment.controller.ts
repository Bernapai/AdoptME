import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointment.service';
import { CreateAppointmentDto } from '../../../Microservicios/appointment-service/src/appointment/dto/createAppointment.dto';
import { UpdateAppointmentDto } from '../../../Microservicios/appointment-service/src/appointment/dto/updateAppointment.dto';
import { Appointment } from '../../../Microservicios/appointment-service/src/appointment/entities/appointment.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Appointments')
@UseGuards(AuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @ApiOperation({ summary: 'Crear una nueva cita' })
  @ApiResponse({ status: 201, description: 'Cita creada correctamente.', type: Appointment })
  @Post()
  create(@Body() dto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(dto);
  }

  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiResponse({ status: 200, description: 'Lista de citas.', type: [Appointment] })
  @Get()
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener cita por ID' })
  @ApiResponse({ status: 200, description: 'Cita encontrada.', type: Appointment })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Actualizar cita por ID' })
  @ApiResponse({ status: 200, description: 'Cita actualizada correctamente.', type: Appointment })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.update(Number(id), dto);
  }

  @ApiOperation({ summary: 'Eliminar cita por ID' })
  @ApiResponse({ status: 200, description: 'Cita eliminada correctamente.' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.appointmentsService.remove(Number(id));
  }
}
