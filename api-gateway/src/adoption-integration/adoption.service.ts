import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/createAdoption.dto';
import { UpdateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/updateAdoption.dto';
import { firstValueFrom } from 'rxjs';
import { Adopcion } from '../../../Microservicios/adoption-service/src/adoption/entities/adoption.entity';

@Injectable()
export class AdoptionService {
  constructor(
    @Inject('ADOPTION_SERVICE') private readonly client: ClientProxy,
  ) { }

  async create(dto: CreateAdopcionDto): Promise<Adopcion> {
    return await firstValueFrom(
      this.client.send({ cmd: 'create-adoption' }, dto),
    );
  }

  async findAll(): Promise<Adopcion[]> {
    return await firstValueFrom(this.client.send({ cmd: 'get-adoptions' }, {}));
  }

  async findOne(id: number): Promise<Adopcion> {
    return await firstValueFrom(this.client.send({ cmd: 'get-adoption' }, id));
  }

  async update(id: number, dto: UpdateAdopcionDto): Promise<Adopcion> {
    return await firstValueFrom(
      this.client.send({ cmd: 'update-adoption' }, { id, dto }),
    );
  }

  async remove(id: number): Promise<void> {
    return await firstValueFrom(
      this.client.send({ cmd: 'delete-adoption' }, id),
    );
  }
}
