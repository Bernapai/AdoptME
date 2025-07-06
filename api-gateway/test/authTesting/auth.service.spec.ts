import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/user-integration/user.service';
import { JwtService } from '@nestjs/jwt';
import { loginUserDto } from 'src/auth/dtos/userLogin.dto';
import { RegisterUserDto } from 'src/auth/dtos/registerDto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUser = {
        idUser: 'uuid',
        nombre: 'Juan',
        email: 'juan@mail.com',
        password: 'hashedpass',
        fechaRegistro: new Date(),
    };

    const usersServiceMock = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };

    const jwtServiceMock = {
        sign: jest.fn().mockReturnValue('jwt-token'),
        verify: jest.fn(),
    };

    beforeEach(async () => {
        (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedpass');
        jest.spyOn(bcrypt, 'compare').mockImplementation(async (pass, hash) => pass === '123456' && hash === 'hashedpass');

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: usersServiceMock },
                { provide: JwtService, useValue: jwtServiceMock },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);

        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            usersServiceMock.findByEmail.mockResolvedValue(null);
            usersServiceMock.create.mockResolvedValue(mockUser);

            const dto: RegisterUserDto = { nombre: 'Juan', email: 'juan@mail.com', password: '123456' };
            const result = await service.register(dto);

            expect(usersServiceMock.findByEmail).toHaveBeenCalledWith('juan@mail.com');
            expect(usersServiceMock.create).toHaveBeenCalledWith({
                nombre: 'Juan',
                email: 'juan@mail.com',
                password: 'hashedpass',
            });
            expect(result).toEqual(mockUser);
        });

        it('should throw if email already registered', async () => {
            usersServiceMock.findByEmail.mockResolvedValue(mockUser);
            const dto: RegisterUserDto = { nombre: 'Juan', email: 'juan@mail.com', password: '123456' };
            await expect(service.register(dto)).rejects.toThrow('Email already registered');
        });
    });

    describe('login', () => {
        it('should return a JWT if credentials are valid', async () => {
            usersServiceMock.findByEmail.mockResolvedValue(mockUser);
            const dto: loginUserDto = { email: 'juan@mail.com', password: '123456' };
            const result = await service.login(dto);

            expect(usersServiceMock.findByEmail).toHaveBeenCalledWith('juan@mail.com');
            expect(jwtServiceMock.sign).toHaveBeenCalledWith({ sub: 'uuid', email: 'juan@mail.com' });
            expect(result).toEqual({ access_token: 'jwt-token' });
        });

        it('should throw if user not found', async () => {
            usersServiceMock.findByEmail.mockResolvedValue(null);
            const dto: loginUserDto = { email: 'juan@mail.com', password: '123456' };
            await expect(service.login(dto)).rejects.toThrow('Invalid credentials');
        });

        it('should throw if password is invalid', async () => {
            usersServiceMock.findByEmail.mockResolvedValue({ ...mockUser, password: 'hashedpass' });
            const dto: loginUserDto = { email: 'juan@mail.com', password: 'wrongpass' };
            await expect(service.login(dto)).rejects.toThrow('Invalid credentials');
        });
    });
});