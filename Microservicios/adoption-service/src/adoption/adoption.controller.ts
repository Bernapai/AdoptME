import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdoptionService } from './adoption.service';
import { CreateAdopcionDto } from './dto/createAdoption.dto';
import { UpdateAdopcionDto } from './dto/updateAdoption.dto';
import { Adopcion } from './adoption.entity';

@Controller()
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) { }

  @MessagePattern({ cmd: 'create-adoption' })
  async create(
    @Payload() createAdopcionDto: CreateAdopcionDto,
  ): Promise<Adopcion> {
    return this.adoptionService.create(createAdopcionDto);
  }

  @MessagePattern({ cmd: 'get-adoptions' })
  async findAll(): Promise<Adopcion[]> {
    return this.adoptionService.findAll();
  }

  @MessagePattern({ cmd: 'get-adoption' })
  async findOne(@Payload() id: number): Promise<Adopcion> {
    return this.adoptionService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-adoption' })
  async update(
    @Payload() payload: { id: number; dto: UpdateAdopcionDto },
  ): Promise<Adopcion> {
    return this.adoptionService.update(payload.id, payload.dto);
  }

  @MessagePattern({ cmd: 'delete-adoption' })
  async remove(@Payload() id: number): Promise<void> {
    return this.adoptionService.remove(id);
  }
}
