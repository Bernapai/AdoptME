import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDomesticoDto } from '../../../Microservicios/animal-service/src/animal/dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from '../../../Microservicios/animal-service/src/animal/dto/updateAnimal.dto';
import { AnimalDomestico } from '../../../Microservicios/animal-service/src/animal/animal.entity';

@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) { }

  @Post()
  async create(
    @Body() dto: CreateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.create(dto);
  }

  @Get()
  async findAll(): Promise<AnimalDomestico[]> {
    return this.animalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AnimalDomestico> {
    return this.animalService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.animalService.remove(Number(id));
  }
}
