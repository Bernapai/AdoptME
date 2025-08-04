import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    // Limpiar cache de findAll
    await this.cacheManager.del('users:all');
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const cached = await this.cacheManager.get<User[]>('users:all');
    if (cached) return cached;

    const users = await this.userRepository.find();
    await this.cacheManager.set('users:all', users, 300); // TTL en segundos
    return users;
  }

  async findOne(id: number): Promise<User> {
    const cacheKey = `users:${id}`;
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findOneBy({ idUser: id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, user, 300);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.userRepository.update(id, updateUserDto);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Limpiar cache del usuario actualizado y de la lista general
    await this.cacheManager.del(`users:${id}`);
    await this.cacheManager.del('users:all');

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Limpiar cache relacionado
    await this.cacheManager.del(`users:${id}`);
    await this.cacheManager.del('users:all');
  }

  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `users:email:${email}`;
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      await this.cacheManager.set(cacheKey, user, 300);
    }

    return user;
  }

  async findByUsername(nombre: string): Promise<User | null> {
    const cacheKey = `users:nombre:${nombre}`;
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findOneBy({ nombre });
    if (user) {
      await this.cacheManager.set(cacheKey, user, 300);
    }

    return user;
  }
}