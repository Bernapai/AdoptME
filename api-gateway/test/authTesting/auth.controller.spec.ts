import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { loginUserDto } from 'src/auth/dtos/userLogin.dto';
import { RegisterUserDto } from 'src/auth/dtos/registerDto';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const authServiceMock = {
        login: jest.fn(),
        register: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: authServiceMock }],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    it('should call AuthService.login on login', async () => {
        const dto: loginUserDto = { email: 'juan@mail.com', password: '123456' };
        authServiceMock.login.mockResolvedValue({ access_token: 'jwt-token' });
        const result = await controller.login(dto);
        expect(authServiceMock.login).toHaveBeenCalledWith(dto);
        expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should call AuthService.register on register', async () => {
        const dto: RegisterUserDto = { nombre: 'Juan', email: 'juan@mail.com', password: '123456' };
        authServiceMock.register.mockResolvedValue({ idUser: 'uuid', ...dto, fechaRegistro: new Date() });
        const result = await controller.register(dto);
        expect(authServiceMock.register).toHaveBeenCalledWith(dto);
        expect(result).toMatchObject({ nombre: 'Juan', email: 'juan@mail.com' });
    });
});