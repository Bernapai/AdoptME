import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, EstadoCita } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/createAppointment.dto';
import { UpdateAppointmentDto } from '../dto/updateAppointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(createAppointmentDto);
    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Limpiar caches relacionados cuando se crea una nueva cita
    await this.cacheManager.del('appointments:all');
    await this.cacheManager.del(`appointments:adoptante:${savedAppointment.adoptanteId}`);
    await this.cacheManager.del(`appointments:mascota:${savedAppointment.mascotaId}`);
    await this.cacheManager.del(`appointments:responsable:${savedAppointment.responsableRefugioId}`);
    await this.cacheManager.del(`appointments:estado:${savedAppointment.estado}`);

    const dateKey = savedAppointment.fechaHora.toISOString().split('T')[0];
    await this.cacheManager.del(`appointments:date:${dateKey}`);
    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    const cached = await this.cacheManager.get<Appointment[]>('appointments:all');
    if (cached) return cached;

    const appointments = await this.appointmentRepository.find();
    await this.cacheManager.set('appointments:all', appointments, 300); // TTL en segundos
    return appointments;
  }

  async findOne(id: number): Promise<Appointment> {
    const cacheKey = `appointments:${id}`;
    const cached = await this.cacheManager.get<Appointment>(cacheKey);
    if (cached) return cached;

    const appointment = await this.appointmentRepository.findOneBy({
      idCita: id,
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, appointment, 300);
    return appointment;
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const result = await this.appointmentRepository.update(id, updateAppointmentDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    // Obtener la cita original para limpiar caches específicos
    const originalAppointment = await this.appointmentRepository.findOneBy({
      idCita: id,
    });

    // Limpiar cache del appointment actualizado y de la lista general
    await this.cacheManager.del(`appointments:${id}`);
    await this.cacheManager.del('appointments:all');

    if (originalAppointment) {
      await this.cacheManager.del(`appointments:adoptante:${originalAppointment.adoptanteId}`);
      await this.cacheManager.del(`appointments:mascota:${originalAppointment.mascotaId}`);
      await this.cacheManager.del(`appointments:responsable:${originalAppointment.responsableRefugioId}`);
      await this.cacheManager.del(`appointments:estado:${originalAppointment.estado}`);

      const dateKey = originalAppointment.fechaHora.toISOString().split('T')[0];
      await this.cacheManager.del(`appointments:date:${dateKey}`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Obtener la cita antes de eliminarla para limpiar caches específicos
    const appointmentToDelete = await this.appointmentRepository.findOneBy({
      idCita: id,
    });

    const result = await this.appointmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    // Limpiar cache relacionado
    await this.cacheManager.del(`appointments:${id}`);
    await this.cacheManager.del('appointments:all');

    if (appointmentToDelete) {
      await this.cacheManager.del(`appointments:adoptante:${appointmentToDelete.adoptanteId}`);
      await this.cacheManager.del(`appointments:mascota:${appointmentToDelete.mascotaId}`);
      await this.cacheManager.del(`appointments:responsable:${appointmentToDelete.responsableRefugioId}`);
      await this.cacheManager.del(`appointments:estado:${appointmentToDelete.estado}`);

      const dateKey = appointmentToDelete.fechaHora.toISOString().split('T')[0];
      await this.cacheManager.del(`appointments:date:${dateKey}`);
    }
  }

  // Métodos adicionales que podrías necesitar con cache
  async findByAdoptanteId(adoptanteId: string): Promise<Appointment[]> {
    const cacheKey = `appointments:adoptante:${adoptanteId}`;
    const cached = await this.cacheManager.get<Appointment[]>(cacheKey);
    if (cached) return cached;

    const appointments = await this.appointmentRepository.find({
      where: { adoptanteId: adoptanteId },
    });

    if (appointments.length > 0) {
      await this.cacheManager.set(cacheKey, appointments, 300);
    }

    return appointments;
  }

  async findByMascotaId(mascotaId: string): Promise<Appointment[]> {
    const cacheKey = `appointments:mascota:${mascotaId}`;
    const cached = await this.cacheManager.get<Appointment[]>(cacheKey);
    if (cached) return cached;

    const appointments = await this.appointmentRepository.find({
      where: { mascotaId: mascotaId },
    });

    if (appointments.length > 0) {
      await this.cacheManager.set(cacheKey, appointments, 300);
    }

    return appointments;
  }

  async findByResponsableId(responsableRefugioId: string): Promise<Appointment[]> {
    const cacheKey = `appointments:responsable:${responsableRefugioId}`;
    const cached = await this.cacheManager.get<Appointment[]>(cacheKey);
    if (cached) return cached;

    const appointments = await this.appointmentRepository.find({
      where: { responsableRefugioId: responsableRefugioId },
    });

    if (appointments.length > 0) {
      await this.cacheManager.set(cacheKey, appointments, 300);
    }

    return appointments;
  }

  async findByEstado(estado: EstadoCita): Promise<Appointment[]> {
    const cacheKey = `appointments:estado:${estado}`;
    const cached = await this.cacheManager.get<Appointment[]>(cacheKey);
    if (cached) return cached;

    const appointments = await this.appointmentRepository.find({
      where: { estado: estado },
    });

    if (appointments.length > 0) {
      await this.cacheManager.set(cacheKey, appointments, 300);
    }

    return appointments;
  }

  async findByDate(date: Date): Promise<Appointment[]> {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const cacheKey = `appointments:date:${date.toISOString().split('T')[0]}`;
    const cached = await this.cacheManager.get<Appointment[]>(cacheKey);
    if (cached) return cached;

    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.fechaHora >= :dateStart', { dateStart })
      .where('appointment.fechaHora <= :dateEnd', { dateEnd })
      .getMany();

    if (appointments.length > 0) {
      await this.cacheManager.set(cacheKey, appointments, 300);
    }

    return appointments;
  }
}