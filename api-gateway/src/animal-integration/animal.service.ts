import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAnimalDomesticoDto } from '../../../Microservicios/animal-service/src/animal/dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from '../../../Microservicios/animal-service/src/animal/dto/updateAnimal.dto';
import { lastValueFrom } from 'rxjs';
import { AnimalDomestico } from '../../../Microservicios/animal-service/src/animal/entities/animal.entity';

@Injectable()
export class AnimalService {
  constructor(@Inject('ANIMAL_SERVICE') private readonly client: ClientProxy) { }

  async create(dto: CreateAnimalDomesticoDto): Promise<AnimalDomestico> {
    return lastValueFrom(this.client.send({ cmd: 'create-animal' }, dto));
  }

  async findAll(): Promise<AnimalDomestico[]> {
    return lastValueFrom(this.client.send({ cmd: 'get-animals' }, {}));
  }

  async findOne(id: number): Promise<AnimalDomestico> {
    return lastValueFrom(this.client.send({ cmd: 'get-animal' }, id));
  }

  async update(
    id: number,
    dto: UpdateAnimalDomesticoDto,
  ): Promise<AnimalDomestico> {
    return lastValueFrom(
      this.client.send({ cmd: 'update-animal' }, { id, dto }),
    );
  }

  async remove(id: number): Promise<void> {
    return lastValueFrom(this.client.send({ cmd: 'delete-animal' }, id));
  }
}
