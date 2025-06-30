import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnimalService } from './animal.service';
import { CreateAnimalDomesticoDto } from '../../../Microservicios/animal-service/src/animal/dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from '../../../Microservicios/animal-service/src/animal/dto/updateAnimal.dto';
import { AnimalDomestico } from '../../../Microservicios/animal-service/src/animal/animal.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Animals')
@UseGuards(AuthGuard)
@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) { }

  @ApiOperation({ summary: 'Crear un nuevo animal doméstico' })
  @ApiResponse({ status: 201, description: 'Animal creado correctamente.', type: AnimalDomestico })
  @Post()
  async create(
    @Body() dto: CreateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.create(dto);
  }

  @ApiOperation({ summary: 'Obtener todos los animales domésticos' })
  @ApiResponse({ status: 200, description: 'Lista de animales domésticos.', type: [AnimalDomestico] })
  @Get()
  async findAll(): Promise<AnimalDomestico[]> {
    return this.animalService.findAll();
  }

  @ApiOperation({ summary: 'Obtener animal doméstico por ID' })
  @ApiResponse({ status: 200, description: 'Animal encontrado.', type: AnimalDomestico })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AnimalDomestico> {
    return this.animalService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Actualizar animal doméstico por ID' })
  @ApiResponse({ status: 200, description: 'Animal actualizado correctamente.', type: AnimalDomestico })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.update(Number(id), dto);
  }

  @ApiOperation({ summary: 'Eliminar animal doméstico por ID' })
  @ApiResponse({ status: 200, description: 'Animal eliminado correctamente.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.animalService.remove(Number(id));
  }
}
