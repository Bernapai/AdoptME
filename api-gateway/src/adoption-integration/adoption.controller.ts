import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  Client,
  ClientProxy,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { CreateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/createAdoption.dto';
import { UpdateAdopcionDto } from '../../../Microservicios/adoption-service/src/adoption/dto/updateAdoption.dto';

@Controller('adoption')
export class AdoptionController {
  @Client({ transport: Transport.TCP })
  private client: ClientProxy;

  @Post()
  async create(@Body() createAdopcionDto: CreateAdopcionDto) {
    return this.client.send({ cmd: 'create-adoption' }, createAdopcionDto);
  }

  @Get()
  async findAll() {
    return this.client.send({ cmd: 'get-adoptions' }, {});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'get-adoption' }, Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAdopcionDto: UpdateAdopcionDto) {
    return this.client.send(
      { cmd: 'update-adoption' },
      { id: Number(id), dto: updateAdopcionDto },
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete-adoption' }, Number(id));
  }
}
