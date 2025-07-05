import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimalDomestico } from './entities/animal.entity';
import { CreateAnimalDomesticoDto } from './dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from './dto/updateAnimal.dto';
@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(AnimalDomestico)
    private readonly animalRepository: Repository<AnimalDomestico>,
  ) { }

  async create(
    createAnimalDomesticoDto: CreateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    const animal = this.animalRepository.create(createAnimalDomesticoDto);
    return this.animalRepository.save(animal);
  }

  async findAll(): Promise<AnimalDomestico[]> {
    return this.animalRepository.find();
  }

  async findOne(id: number): Promise<AnimalDomestico> {
    const animal = await this.animalRepository.findOneBy({
      idMascota: id.toString(),
    });
    if (!animal) {
      throw new Error(`Animal with id ${id} not found`);
    }
    return animal;
  }

  async update(
    id: number,
    updateAnimalDomesticoDto: UpdateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    await this.animalRepository.update(id, updateAnimalDomesticoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.animalRepository.delete(id);
  }
}
