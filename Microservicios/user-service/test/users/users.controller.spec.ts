import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/controllers/users.controller';
import { UsersService } from '../../src/users/services/users.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { User } from 'src/users/entities/users.entity';

// para que no bloquee tests
jest.mock('src/auth/jwt-auth.guard', () => ({
    JwtAuthGuard: class {
        canActivate() {
            return true;
        }
    },
}));


describe('UsersController', () => {
    let controller: UsersController;

    const mockUser: User = {
        idUser: 1,
        nombre: 'Alice',
        email: 'alice@example.com',
        password: 'secure123',
        fechaRegistro: new Date(),
    };

    const mockUsersService = {
        getAll: jest.fn(),
        getOne: jest.fn(),
        register: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);

        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return an array of users', async () => {
            mockUsersService.getAll.mockResolvedValue([mockUser]);
            const result = await controller.findAll();
            expect(result).toEqual([mockUser]);
            expect(mockUsersService.getAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            mockUsersService.getAll.mockRejectedValue(new Error('DB error'));
            await expect(controller.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('getOne', () => {
        it('should return a user by id', async () => {
            mockUsersService.getOne.mockResolvedValue(mockUser);
            const result = await controller.findOne(1);
            expect(result).toEqual(mockUser);
            expect(mockUsersService.getOne).toHaveBeenCalledWith(1);
        });

        it('should return null if user not found', async () => {
            mockUsersService.getOne.mockResolvedValue(null);
            const result = await controller.findOne(999);
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockUsersService.getOne.mockRejectedValue(new Error('DB error'));
            await expect(controller.findOne(1)).rejects.toThrow('DB error');
        });
    });

    describe('register', () => {
        it('should create and return a new user', async () => {
            const dto: CreateUserDto = {
                nombre: 'Bob',
                email: 'bob@example.com',
                password: 'pass123',
            };
            mockUsersService.register.mockResolvedValue(mockUser);
            const result = await controller.create(dto);
            expect(result).toEqual(mockUser);
            expect(mockUsersService.register).toHaveBeenCalledWith(dto);
        });

        it('should handle errors', async () => {
            mockUsersService.register.mockRejectedValue(new Error('Validation error'));
            await expect(controller.create({ nombre: '', email: '', password: '' })).rejects.toThrow('Validation error');
        });
    });

    describe('update', () => {
        it('should update and return the user', async () => {
            const dto: UpdateUserDto = { nombre: 'Alice Updated' };
            mockUsersService.update.mockResolvedValue({ ...mockUser, ...dto });
            const result = await controller.update({ id: 1, dto });
            expect(result).toEqual({ ...mockUser, ...dto });
            expect(mockUsersService.update).toHaveBeenCalledWith(1, dto);
        });

        it('should return null if user not found', async () => {
            mockUsersService.update.mockResolvedValue(null);
            const result = await controller.update({ id: 999, dto: { nombre: 'No User' } });
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockUsersService.update.mockRejectedValue(new Error('Update error'));
            await expect(controller.update({ id: 1, dto: { nombre: 'err' } })).rejects.toThrow('Update error');
        });
    });


    describe('delete', () => {
        it('should call remove on the service', async () => {
            mockUsersService.delete.mockResolvedValue(undefined);
            await expect(controller.remove(1)).resolves.toBeUndefined();
            expect(mockUsersService.delete).toHaveBeenCalledWith(1);
        });

        it('should handle errors', async () => {
            mockUsersService.delete.mockRejectedValue(new Error('Delete error'));
            await expect(controller.remove(1)).rejects.toThrow('Delete error');
        });
    });
})

