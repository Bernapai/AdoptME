import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';

describe('UsersService', () => {
    let service: UsersService;

    const mockUserRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all users', async () => {
            const users = [{ idUser: 1, nombre: 'Test' }] as User[];
            mockUserRepository.find.mockResolvedValue(users);

            const result = await service.findAll();
            expect(result).toEqual(users);
            expect(mockUserRepository.find).toHaveBeenCalled();
        });

        it('should throw error if find fails', async () => {
            mockUserRepository.find.mockRejectedValue(new Error('DB error'));
            await expect(service.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('register', () => {
        it('should create and return a new user', async () => {
            const dto: CreateUserDto = {
                nombre: 'Test',
                email: 'test@example.com',
                password: '123456',
            };
            const newUser = { idUser: 1, ...dto } as User;

            mockUserRepository.create.mockReturnValue(newUser);
            mockUserRepository.save.mockResolvedValue(newUser);

            const result = await service.create(dto);
            expect(result).toEqual(newUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
            expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
        });

        it('should throw error if save fails', async () => {
            const dto: CreateUserDto = {
                nombre: 'Test',
                email: 'test@example.com',
                password: '123456',
            };
            const newUser = { idUser: 1, ...dto } as User;

            mockUserRepository.create.mockReturnValue(newUser);
            mockUserRepository.save.mockRejectedValue(new Error('Save error'));

            await expect(service.create(dto)).rejects.toThrow('Save error');
        });
    });

    describe('getOne', () => {
        it('should return a user by id', async () => {
            const user = { idUser: 1, nombre: 'Test' } as User;
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.findOne(1);
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should return null if user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await service.findOne(999);
            expect(result).toBeNull();
        });

        it('should throw error if findOne fails', async () => {
            mockUserRepository.findOne.mockRejectedValue(new Error('FindOne error'));
            await expect(service.findOne(1)).rejects.toThrow('FindOne error');
        });
    });

    describe('findByName', () => {
        it('should return a user by name', async () => {
            const user = { idUser: 1, nombre: 'John' } as User;
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.findByUsername('John');
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { name: 'John' },
            });
        });

        it('should return null if user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await service.findByUsername('NoName');
            expect(result).toBeNull();
        });

        it('should throw error if findOne fails', async () => {
            mockUserRepository.findOne.mockRejectedValue(new Error('FindByName error'));
            await expect(service.findByUsername('Test')).rejects.toThrow('FindByName error');
        });
    });

    describe('update', () => {
        it('should update and return the user', async () => {
            const dto: UpdateUserDto = { nombre: 'Updated' };
            const updatedUser = { idUser: 1, nombre: 'Updated' } as User;

            mockUserRepository.update.mockResolvedValue({ affected: 1 });
            mockUserRepository.findOne.mockResolvedValue(updatedUser);

            const result = await service.update(1, dto);
            expect(result).toEqual(updatedUser);
            expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should return null if user not found after update', async () => {
            const dto: UpdateUserDto = { nombre: 'Updated' };
            mockUserRepository.update.mockResolvedValue({ affected: 1 });
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await service.update(999, dto);
            expect(result).toBeNull();
        });

        it('should throw error if update fails', async () => {
            const dto: UpdateUserDto = { nombre: 'Updated' };
            mockUserRepository.update.mockRejectedValue(new Error('Update error'));

            await expect(service.update(1, dto)).rejects.toThrow('Update error');
        });

        it('should throw error if findOne fails after update', async () => {
            const dto: UpdateUserDto = { nombre: 'Updated' };
            mockUserRepository.update.mockResolvedValue({ affected: 1 });
            mockUserRepository.findOne.mockRejectedValue(new Error('FindOne error'));

            await expect(service.update(1, dto)).rejects.toThrow('FindOne error');
        });
    });

    describe('delete', () => {
        it('should return true if user is deleted', async () => {
            mockUserRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.remove(1);
            expect(result).toBe(true);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should return false if user is not found', async () => {
            mockUserRepository.delete.mockResolvedValue({ affected: 0 });

            const result = await service.remove(999);
            expect(result).toBe(false);
        });

        it('should throw error if delete fails', async () => {
            mockUserRepository.delete.mockRejectedValue(new Error('Delete error'));
            await expect(service.remove(1)).rejects.toThrow('Delete error');
        });
    });

    describe('findBByname', () => {
        it('should return user by name (duplicated method)', async () => {
            const user = { idUser: 1, nombre: 'Test' } as User;
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.findByUsername('Test');
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { name: 'Test' },
            });
        });
    });
});
