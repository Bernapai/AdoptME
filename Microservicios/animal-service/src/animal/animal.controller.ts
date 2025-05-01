import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AnimalService } from './animal.service';
import { CreateAnimalDomesticoDto } from './dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from './dto/updateAnimal.dto';
import { AnimalDomestico } from './animal.entity';

@Controller()
export class AnimalController {
  constructor(private readonly animalService: AnimalService) { }

  @MessagePattern({ cmd: 'create-animal' })
  async create(
    @Payload() createAnimalDomesticoDto: CreateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return this.animalService.create(createAnimalDomesticoDto);
  }

  @MessagePattern({ cmd: 'get-animals' })
  async findAll(): Promise<AnimalDomestico[]> {
    return this.animalService.findAll();
  }

  @MessagePattern({ cmd: 'get-animal' })
  async findOne(@Payload() id: number): Promise<AnimalDomestico> {
    return this.animalService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-animal' })
  async update(
    @Payload() payload: { id: number; dto: UpdateAnimalDomesticoDto },
  ): Promise<AnimalDomestico> {
    return this.animalService.update(payload.id, payload.dto);
  }

  @MessagePattern({ cmd: 'delete-animal' })
  async remove(@Payload() id: number): Promise<void> {
    return this.animalService.remove(id);
  }
}
