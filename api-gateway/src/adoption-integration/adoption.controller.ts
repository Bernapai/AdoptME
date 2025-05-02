import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AdoptionService } from './adoption.service';
import { CreateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/createAdoption.dto';
import { UpdateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/updateAdoption.dto';
import { Adopcion } from '../../../Microservicios/adoption-service/src/adoption/adoption.entity';

@Controller('adoptions')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) { }

  @Post()
  async create(@Body() dto: CreateAdopcionDto): Promise<Adopcion> {
    return this.adoptionService.create(dto);
  }

  @Get()
  async findAll(): Promise<Adopcion[]> {
    return this.adoptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Adopcion> {
    return this.adoptionService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdopcionDto,
  ): Promise<Adopcion> {
    return this.adoptionService.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.adoptionService.remove(Number(id));
  }
}
