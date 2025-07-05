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
import { AdoptionService } from './adoption.service';
import { CreateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/createAdoption.dto';
import { UpdateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/updateAdoption.dto';
import { Adopcion } from '../../../Microservicios/adoption-service/src/adoption/entities/adoption.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Adoptions')
@UseGuards(AuthGuard)
@Controller('adoptions')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) { }

  @ApiOperation({ summary: 'Crear una nueva adopción' })
  @ApiResponse({ status: 201, description: 'Adopción creada correctamente.', type: Adopcion })
  @Post()
  async create(@Body() dto: CreateAdopcionDto): Promise<Adopcion> {
    return this.adoptionService.create(dto);
  }

  @ApiOperation({ summary: 'Obtener todas las adopciones' })
  @ApiResponse({ status: 200, description: 'Lista de adopciones.', type: [Adopcion] })
  @Get()
  async findAll(): Promise<Adopcion[]> {
    return this.adoptionService.findAll();
  }

  @ApiOperation({ summary: 'Obtener adopción por ID' })
  @ApiResponse({ status: 200, description: 'Adopción encontrada.', type: Adopcion })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Adopcion> {
    return this.adoptionService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Actualizar adopción por ID' })
  @ApiResponse({ status: 200, description: 'Adopción actualizada correctamente.', type: Adopcion })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdopcionDto,
  ): Promise<Adopcion> {
    return this.adoptionService.update(Number(id), dto);
  }

  @ApiOperation({ summary: 'Eliminar adopción por ID' })
  @ApiResponse({ status: 200, description: 'Adopción eliminada correctamente.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.adoptionService.remove(Number(id));
  }
}
