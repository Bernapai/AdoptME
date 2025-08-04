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
import { AnimalDomestico } from '../../../Microservicios/animal-service/src/animal/entities/animal.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ShortThrottle, MediumThrottle, LongThrottle } from 'src/config/decorators/custom-throttle.decorator';

@ApiTags('Animals')
@UseGuards(AuthGuard)
@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) { }

  @ApiOperation({ summary: 'Crear un nuevo animal doméstico' })
  @ApiResponse({ status: 201, description: 'Animal creado correctamente.', type: AnimalDomestico })
  @ShortThrottle() // 5 creaciones por minuto - Restrictivo para evitar spam
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() dto: CreateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.create(dto);
  }

  @ApiOperation({ summary: 'Obtener todos los animales domésticos' })
  @ApiResponse({ status: 200, description: 'Lista de animales domésticos.', type: [AnimalDomestico] })
  @MediumThrottle() // 500 requests por 5 minutos - Moderado para consultas masivas
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<AnimalDomestico[]> {
    return this.animalService.findAll();
  }

  @ApiOperation({ summary: 'Obtener animal doméstico por ID' })
  @ApiResponse({ status: 200, description: 'Animal encontrado.', type: AnimalDomestico })
  @ShortThrottle() // 100 requests por minuto - Permisivo para consultas individuales
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AnimalDomestico> {
    return this.animalService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Actualizar animal doméstico por ID' })
  @ApiResponse({ status: 200, description: 'Animal actualizado correctamente.', type: AnimalDomestico })
  @MediumThrottle() // 10 actualizaciones por minuto - Restrictivo
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.update(Number(id), dto);
  }

  @ApiOperation({ summary: 'Eliminar animal doméstico por ID' })
  @ApiResponse({ status: 200, description: 'Animal eliminado correctamente.' })
  @LongThrottle() // 5 eliminaciones por minuto - Moderado para evitar spam
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.animalService.remove(Number(id));
  }
}
