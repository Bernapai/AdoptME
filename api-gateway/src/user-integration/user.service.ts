import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '../../../Microservicios/user-service/src/users/dto/createUser.dto';
import { UpdateUserDto } from '../../../Microservicios/user-service/src/users/dto/updateUser.dto';
import { User } from '../../../Microservicios/user-service/src/users/users.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientProxy) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return firstValueFrom(
      this.client.send({ cmd: 'create-user' }, createUserDto),
    );
  }

  async findAll(): Promise<User[]> {
    return firstValueFrom(this.client.send({ cmd: 'get-users' }, {}));
  }

  async findOne(id: number): Promise<User> {
    return firstValueFrom(this.client.send({ cmd: 'get-user' }, id));
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return firstValueFrom(
      this.client.send({ cmd: 'update-user' }, { id, dto: updateUserDto }),
    );
  }

  async remove(id: number): Promise<void> {
    return firstValueFrom(this.client.send({ cmd: 'delete-user' }, id));
  }
}
