import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adopcion } from '../entities/adoption.entity';
import { CreateAdopcionDto } from '../dto/createAdoption.dto';
import { UpdateAdopcionDto } from '../dto/updateAdoption.dto';
@Injectable()
export class AdoptionService {
  constructor(
    @InjectRepository(Adopcion)
    private readonly adopcionRepository: Repository<Adopcion>,
  ) { }

  async create(createAdopcionDto: CreateAdopcionDto): Promise<Adopcion> {
    const adopcion = this.adopcionRepository.create(createAdopcionDto);
    return this.adopcionRepository.save(adopcion);
  }

  async findAll(): Promise<Adopcion[]> {
    return this.adopcionRepository.find();
  }

  async findOne(id: number): Promise<Adopcion> {
    const adopcion = await this.adopcionRepository.findOneBy({
      idAdopcion: id,
    });
    if (!adopcion) {
      throw new Error(`Adopcion with id ${id} not found`);
    }
    return adopcion;
  }

  async update(
    id: number,
    updateAdopcionDto: UpdateAdopcionDto,
  ): Promise<Adopcion> {
    await this.adopcionRepository.update(id, updateAdopcionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.adopcionRepository.delete(id);
  }
}
