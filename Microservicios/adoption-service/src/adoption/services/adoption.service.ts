import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adopcion, EstadoAdopcion } from '../entities/adoption.entity';
import { CreateAdopcionDto } from '../dto/createAdoption.dto';
import { UpdateAdopcionDto } from '../dto/updateAdoption.dto';

@Injectable()
export class AdoptionService {
  constructor(
    @InjectRepository(Adopcion)
    private readonly adopcionRepository: Repository<Adopcion>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async create(createAdopcionDto: CreateAdopcionDto): Promise<Adopcion> {
    const adopcion = this.adopcionRepository.create(createAdopcionDto);
    const savedAdopcion = await this.adopcionRepository.save(adopcion);

    // Limpiar caches relacionados cuando se crea una nueva adopción
    await this.cacheManager.del('adoptions:all');
    await this.cacheManager.del(`adoptions:adoptante:${savedAdopcion.adoptanteId}`);
    await this.cacheManager.del(`adoptions:mascota:${savedAdopcion.mascotaId}`);
    await this.cacheManager.del(`adoptions:responsable:${savedAdopcion.responsableRefugioId}`);
    await this.cacheManager.del(`adoptions:estado:${savedAdopcion.estado}`);

    const dateKey = savedAdopcion.fechaAdopcion.toISOString().split('T')[0];
    await this.cacheManager.del(`adoptions:date:${dateKey}`);

    return savedAdopcion;
  }

  async findAll(): Promise<Adopcion[]> {
    const cached = await this.cacheManager.get<Adopcion[]>('adoptions:all');
    if (cached) return cached;

    const adoptions = await this.adopcionRepository.find();
    await this.cacheManager.set('adoptions:all', adoptions, 300); // TTL en segundos
    return adoptions;
  }

  async findOne(id: number): Promise<Adopcion> {
    const cacheKey = `adoptions:${id}`;
    const cached = await this.cacheManager.get<Adopcion>(cacheKey);
    if (cached) return cached;

    const adopcion = await this.adopcionRepository.findOneBy({
      idAdopcion: id,
    });
    if (!adopcion) {
      throw new NotFoundException(`Adopcion with id ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, adopcion, 300);
    return adopcion;
  }

  async update(
    id: number,
    updateAdopcionDto: UpdateAdopcionDto,
  ): Promise<Adopcion> {
    // Obtener la adopción original para limpiar caches específicos
    const originalAdopcion = await this.adopcionRepository.findOneBy({
      idAdopcion: id,
    });

    const result = await this.adopcionRepository.update(id, updateAdopcionDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Adopcion with id ${id} not found`);
    }

    // Limpiar cache de la adopción actualizada y de la lista general
    await this.cacheManager.del(`adoptions:${id}`);
    await this.cacheManager.del('adoptions:all');

    if (originalAdopcion) {
      await this.cacheManager.del(`adoptions:adoptante:${originalAdopcion.adoptanteId}`);
      await this.cacheManager.del(`adoptions:mascota:${originalAdopcion.mascotaId}`);
      await this.cacheManager.del(`adoptions:responsable:${originalAdopcion.responsableRefugioId}`);
      await this.cacheManager.del(`adoptions:estado:${originalAdopcion.estado}`);

      const dateKey = originalAdopcion.fechaAdopcion.toISOString().split('T')[0];
      await this.cacheManager.del(`adoptions:date:${dateKey}`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Obtener la adopción antes de eliminarla para limpiar caches específicos
    const adopcionToDelete = await this.adopcionRepository.findOneBy({
      idAdopcion: id,
    });

    const result = await this.adopcionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Adopcion with id ${id} not found`);
    }

    // Limpiar cache relacionado
    await this.cacheManager.del(`adoptions:${id}`);
    await this.cacheManager.del('adoptions:all');

    if (adopcionToDelete) {
      await this.cacheManager.del(`adoptions:adoptante:${adopcionToDelete.adoptanteId}`);
      await this.cacheManager.del(`adoptions:mascota:${adopcionToDelete.mascotaId}`);
      await this.cacheManager.del(`adoptions:responsable:${adopcionToDelete.responsableRefugioId}`);
      await this.cacheManager.del(`adoptions:estado:${adopcionToDelete.estado}`);

      const dateKey = adopcionToDelete.fechaAdopcion.toISOString().split('T')[0];
      await this.cacheManager.del(`adoptions:date:${dateKey}`);
    }
  }

  // Métodos adicionales con cache para búsquedas específicas
  async findByAdoptanteId(adoptanteId: string): Promise<Adopcion[]> {
    const cacheKey = `adoptions:adoptante:${adoptanteId}`;
    const cached = await this.cacheManager.get<Adopcion[]>(cacheKey);
    if (cached) return cached;

    const adoptions = await this.adopcionRepository.find({
      where: { adoptanteId: adoptanteId },
    });

    if (adoptions.length > 0) {
      await this.cacheManager.set(cacheKey, adoptions, 300);
    }

    return adoptions;
  }

  async findByMascotaId(mascotaId: string): Promise<Adopcion[]> {
    const cacheKey = `adoptions:mascota:${mascotaId}`;
    const cached = await this.cacheManager.get<Adopcion[]>(cacheKey);
    if (cached) return cached;

    const adoptions = await this.adopcionRepository.find({
      where: { mascotaId: mascotaId },
    });

    if (adoptions.length > 0) {
      await this.cacheManager.set(cacheKey, adoptions, 300);
    }

    return adoptions;
  }

  async findByResponsableId(responsableRefugioId: string): Promise<Adopcion[]> {
    const cacheKey = `adoptions:responsable:${responsableRefugioId}`;
    const cached = await this.cacheManager.get<Adopcion[]>(cacheKey);
    if (cached) return cached;

    const adoptions = await this.adopcionRepository.find({
      where: { responsableRefugioId: responsableRefugioId },
    });

    if (adoptions.length > 0) {
      await this.cacheManager.set(cacheKey, adoptions, 300);
    }

    return adoptions;
  }

  async findByEstado(estado: EstadoAdopcion): Promise<Adopcion[]> {
    const cacheKey = `adoptions:estado:${estado}`;
    const cached = await this.cacheManager.get<Adopcion[]>(cacheKey);
    if (cached) return cached;

    const adoptions = await this.adopcionRepository.find({
      where: { estado: estado },
    });

    if (adoptions.length > 0) {
      await this.cacheManager.set(cacheKey, adoptions, 300);
    }

    return adoptions;
  }

  async findByDate(date: Date): Promise<Adopcion[]> {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const cacheKey = `adoptions:date:${date.toISOString().split('T')[0]}`;
    const cached = await this.cacheManager.get<Adopcion[]>(cacheKey);
    if (cached) return cached;

    const adoptions = await this.adopcionRepository
      .createQueryBuilder('adopcion')
      .where('adopcion.fechaAdopcion >= :dateStart', { dateStart })
      .andWhere('adopcion.fechaAdopcion <= :dateEnd', { dateEnd })
      .getMany();

    if (adoptions.length > 0) {
      await this.cacheManager.set(cacheKey, adoptions, 300);
    }

    return adoptions;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Adopcion[]> {
    const startKey = startDate.toISOString().split('T')[0];
    const endKey = endDate.toISOString().split('T')[0];
    const cacheKey = `adoptions:range:${startKey}:${endKey}`;
    const cached = await this.cacheManager.get<Adopcion[]>(cacheKey);
    if (cached) return cached;

    const adoptions = await this.adopcionRepository
      .createQueryBuilder('adopcion')
      .where('adopcion.fechaAdopcion >= :startDate', { startDate })
      .andWhere('adopcion.fechaAdopcion <= :endDate', { endDate })
      .orderBy('adopcion.fechaAdopcion', 'DESC')
      .getMany();

    if (adoptions.length > 0) {
      await this.cacheManager.set(cacheKey, adoptions, 300);
    }

    return adoptions;
  }

  async findCompletedAdoptions(): Promise<Adopcion[]> {
    return this.findByEstado(EstadoAdopcion.COMPLETADA);
  }

  async findPendingAdoptions(): Promise<Adopcion[]> {
    return this.findByEstado(EstadoAdopcion.PENDIENTE);
  }

  async findCancelledAdoptions(): Promise<Adopcion[]> {
    return this.findByEstado(EstadoAdopcion.CANCELADA);
  }

  async getAdoptionStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
  }> {
    const cacheKey = 'adoptions:stats';
    const cached = await this.cacheManager.get<{
      total: number;
      completed: number;
      pending: number;
      cancelled: number;
    }>(cacheKey);
    if (cached) return cached;

    const [total, completed, pending, cancelled] = await Promise.all([
      this.adopcionRepository.count(),
      this.adopcionRepository.count({ where: { estado: EstadoAdopcion.COMPLETADA } }),
      this.adopcionRepository.count({ where: { estado: EstadoAdopcion.PENDIENTE } }),
      this.adopcionRepository.count({ where: { estado: EstadoAdopcion.CANCELADA } }),
    ]);

    const stats = { total, completed, pending, cancelled };
    await this.cacheManager.set(cacheKey, stats, 600); // Cache más largo para estadísticas

    return stats;
  }

  async findRecentAdoptions(days: number = 30): Promise<Adopcion[]> {
    const cacheKey = `adoptions:recent:${days}`;
    const cached = await this.cacheManager.get<Adopcion[]>(cacheKey);
    if (cached) return cached;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const adoptions = await this.adopcionRepository
      .createQueryBuilder('adopcion')
      .where('adopcion.fechaAdopcion >= :dateThreshold', { dateThreshold })
      .orderBy('adopcion.fechaAdopcion', 'DESC')
      .getMany();

    if (adoptions.length > 0) {
      await this.cacheManager.set(cacheKey, adoptions, 180); // Cache más corto para datos recientes
    }

    return adoptions;
  }
}