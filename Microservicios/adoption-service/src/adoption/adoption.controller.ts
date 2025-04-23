import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { AdoptionService } from './adoption.service';
import { CreateAdopcionDto } from './dto/createAdoption.dto';
import { UpdateAdopcionDto } from './dto/updateAdoption.dto';
import { Adopcion } from './adoption.entity';
@Controller('adoption')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) { }

  @Post()
  async create(
    @Body() createAdopcionDto: CreateAdopcionDto,
  ): Promise<Adopcion> {
    return this.adoptionService.create(createAdopcionDto);
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
    @Body() updateAdopcionDto: UpdateAdopcionDto,
  ): Promise<Adopcion> {
    return this.adoptionService.update(Number(id), updateAdopcionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.adoptionService.remove(Number(id));
  }
}
