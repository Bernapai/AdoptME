import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDomesticoDto } from './dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from './dto/updateAnimal.dto';
import { AnimalDomestico } from './animal.entity';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) { }

  @Post()
  async create(
    @Body() createAnimalDomesticoDto: CreateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.create(createAnimalDomesticoDto);
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
    @Body() updateAnimalDomesticoDto: UpdateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.update(Number(id), updateAnimalDomesticoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.animalService.remove(Number(id));
  }
}
