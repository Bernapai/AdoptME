import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimalDomestico, EspecieMascota, EstadoSalud } from '../entities/animal.entity';
import { CreateAnimalDomesticoDto } from '../dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from '../dto/updateAnimal.dto';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(AnimalDomestico)
    private readonly animalRepository: Repository<AnimalDomestico>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async create(
    createAnimalDomesticoDto: CreateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    const animal = this.animalRepository.create(createAnimalDomesticoDto);
    const savedAnimal = await this.animalRepository.save(animal);

    // Limpiar caches relacionados cuando se crea un nuevo animal
    await this.cacheManager.del('animals:all');
    await this.cacheManager.del(`animals:especie:${savedAnimal.especie}`);
    await this.cacheManager.del(`animals:estado:${savedAnimal.estadoSalud}`);
    await this.cacheManager.del(`animals:raza:${savedAnimal.raza}`);

    return savedAnimal;
  }

  async findAll(): Promise<AnimalDomestico[]> {
    const cached = await this.cacheManager.get<AnimalDomestico[]>('animals:all');
    if (cached) return cached;

    const animals = await this.animalRepository.find();
    await this.cacheManager.set('animals:all', animals, 300); // TTL en segundos
    return animals;
  }

  async findOne(id: number): Promise<AnimalDomestico> {
    const cacheKey = `animals:${id}`;
    const cached = await this.cacheManager.get<AnimalDomestico>(cacheKey);
    if (cached) return cached;

    const animal = await this.animalRepository.findOneBy({
      idMascota: id,
    });
    if (!animal) {
      throw new NotFoundException(`Animal with id ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, animal, 300);
    return animal;
  }

  async update(
    id: number,
    updateAnimalDomesticoDto: UpdateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    // Obtener el animal original para limpiar caches específicos
    const originalAnimal = await this.animalRepository.findOneBy({
      idMascota: id,
    });

    const result = await this.animalRepository.update(id, updateAnimalDomesticoDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Animal with id ${id} not found`);
    }

    // Limpiar cache del animal actualizado y de la lista general
    await this.cacheManager.del(`animals:${id}`);
    await this.cacheManager.del('animals:all');

    if (originalAnimal) {
      await this.cacheManager.del(`animals:especie:${originalAnimal.especie}`);
      await this.cacheManager.del(`animals:estado:${originalAnimal.estadoSalud}`);
      await this.cacheManager.del(`animals:raza:${originalAnimal.raza}`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Obtener el animal antes de eliminarlo para limpiar caches específicos
    const animalToDelete = await this.animalRepository.findOneBy({
      idMascota: id,
    });

    const result = await this.animalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Animal with id ${id} not found`);
    }

    // Limpiar cache relacionado
    await this.cacheManager.del(`animals:${id}`);
    await this.cacheManager.del('animals:all');

    if (animalToDelete) {
      await this.cacheManager.del(`animals:especie:${animalToDelete.especie}`);
      await this.cacheManager.del(`animals:estado:${animalToDelete.estadoSalud}`);
      await this.cacheManager.del(`animals:raza:${animalToDelete.raza}`);
    }
  }

  // Métodos adicionales con cache para búsquedas específicas
  async findByEspecie(especie: EspecieMascota): Promise<AnimalDomestico[]> {
    const cacheKey = `animals:especie:${especie}`;
    const cached = await this.cacheManager.get<AnimalDomestico[]>(cacheKey);
    if (cached) return cached;

    const animals = await this.animalRepository.find({
      where: { especie: especie },
    });

    if (animals.length > 0) {
      await this.cacheManager.set(cacheKey, animals, 300);
    }

    return animals;
  }

  async findByEstadoSalud(estadoSalud: EstadoSalud): Promise<AnimalDomestico[]> {
    const cacheKey = `animals:estado:${estadoSalud}`;
    const cached = await this.cacheManager.get<AnimalDomestico[]>(cacheKey);
    if (cached) return cached;

    const animals = await this.animalRepository.find({
      where: { estadoSalud: estadoSalud },
    });

    if (animals.length > 0) {
      await this.cacheManager.set(cacheKey, animals, 300);
    }

    return animals;
  }

  async findByRaza(raza: string): Promise<AnimalDomestico[]> {
    const cacheKey = `animals:raza:${raza}`;
    const cached = await this.cacheManager.get<AnimalDomestico[]>(cacheKey);
    if (cached) return cached;

    const animals = await this.animalRepository.find({
      where: { raza: raza },
    });

    if (animals.length > 0) {
      await this.cacheManager.set(cacheKey, animals, 300);
    }

    return animals;
  }

  async findByNombre(nombre: string): Promise<AnimalDomestico | null> {
    const cacheKey = `animals:nombre:${nombre}`;
    const cached = await this.cacheManager.get<AnimalDomestico>(cacheKey);
    if (cached) return cached;

    const animal = await this.animalRepository.findOneBy({ nombre });
    if (animal) {
      await this.cacheManager.set(cacheKey, animal, 300);
    }

    return animal;
  }

  async findByEdadRange(edadMin: number, edadMax: number): Promise<AnimalDomestico[]> {
    const cacheKey = `animals:edad:${edadMin}-${edadMax}`;
    const cached = await this.cacheManager.get<AnimalDomestico[]>(cacheKey);
    if (cached) return cached;

    const animals = await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.edad >= :edadMin', { edadMin })
      .andWhere('animal.edad <= :edadMax', { edadMax })
      .getMany();

    if (animals.length > 0) {
      await this.cacheManager.set(cacheKey, animals, 300);
    }

    return animals;
  }

  async findRecentlyAdded(days: number = 30): Promise<AnimalDomestico[]> {
    const cacheKey = `animals:recent:${days}`;
    const cached = await this.cacheManager.get<AnimalDomestico[]>(cacheKey);
    if (cached) return cached;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const animals = await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.fechaIngreso >= :dateThreshold', { dateThreshold })
      .orderBy('animal.fechaIngreso', 'DESC')
      .getMany();

    if (animals.length > 0) {
      await this.cacheManager.set(cacheKey, animals, 180); // Cache más corto para datos recientes
    }

    return animals;
  }
}