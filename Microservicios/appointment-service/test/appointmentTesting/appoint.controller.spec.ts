import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from 'src/appointment/controller/appointment.controller';
import { AppointmentService } from 'src/appointment/services/appointment.service';
import { CreateAppointmentDto } from 'src/appointment/dto/createAppointment.dto';
import { UpdateAppointmentDto } from 'src/appointment/dto/updateAppointment.dto';
import { Appointment, EstadoCita } from 'src/appointment/entities/appointment.entity';

// para que no bloquee tests
jest.mock('src/auth/jwt-auth.guard', () => ({
    JwtAuthGuard: class {
        canActivate() {
            return true;
        }
    },
}));

describe('AppointmentController', () => {
    let controller: AppointmentController;

    const mockAppointment: Appointment = {
        idCita: 1,
        fechaHora: new Date(),
        adoptanteId: 'uuid-adoptante',
        mascotaId: 'uuid-mascota',
        responsableRefugioId: 'uuid-responsable',
        estado: EstadoCita.PENDIENTE,
        notas: 'Nota de prueba',
    };

    const mockAppointmentService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppointmentController],
            providers: [
                {
                    provide: AppointmentService,
                    useValue: mockAppointmentService,
                },
            ],
        }).compile();

        controller = module.get<AppointmentController>(AppointmentController);

        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return an array of appointments', async () => {
            mockAppointmentService.findAll.mockResolvedValue([mockAppointment]);
            const result = await controller.findAll();
            expect(result).toEqual([mockAppointment]);
            expect(mockAppointmentService.findAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            mockAppointmentService.findAll.mockRejectedValue(new Error('DB error'));
            await expect(controller.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('findOne', () => {
        it('should return an appointment by id', async () => {
            mockAppointmentService.findOne.mockResolvedValue(mockAppointment);
            const result = await controller.findOne(1);
            expect(result).toEqual(mockAppointment);
            expect(mockAppointmentService.findOne).toHaveBeenCalledWith(1);
        });

        it('should return null if not found', async () => {
            mockAppointmentService.findOne.mockResolvedValue(null);
            const result = await controller.findOne(999);
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockAppointmentService.findOne.mockRejectedValue(new Error('DB error'));
            await expect(controller.findOne(1)).rejects.toThrow('DB error');
        });
    });

    describe('create', () => {
        it('should create and return a new appointment', async () => {
            const dto: CreateAppointmentDto = {
                fechaHora: new Date(),
                adoptanteId: 'uuid-adoptante',
                mascotaId: 'uuid-mascota',
                responsableRefugioId: 'uuid-responsable',
                estado: EstadoCita.PENDIENTE,
                notas: 'Nota de prueba',
            };
            mockAppointmentService.create.mockResolvedValue(mockAppointment);
            const result = await controller.create(dto);
            expect(result).toEqual(mockAppointment);
            expect(mockAppointmentService.create).toHaveBeenCalledWith(dto);
        });

        it('should handle errors', async () => {
            mockAppointmentService.create.mockRejectedValue(new Error('Validation error'));
            await expect(controller.create({} as any)).rejects.toThrow('Validation error');
        });
    });

    describe('update', () => {
        it('should update and return the appointment', async () => {
            const dto: UpdateAppointmentDto = { notas: 'Actualizado' };
            mockAppointmentService.update.mockResolvedValue({ ...mockAppointment, ...dto });
            const result = await controller.update({ id: 1, dto });
            expect(result).toEqual({ ...mockAppointment, ...dto });
            expect(mockAppointmentService.update).toHaveBeenCalledWith(1, dto);
        });

        it('should return null if not found', async () => {
            mockAppointmentService.update.mockResolvedValue(null);
            const result = await controller.update({ id: 999, dto: { notas: 'No existe' } });
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockAppointmentService.update.mockRejectedValue(new Error('Update error'));
            await expect(controller.update({ id: 1, dto: { notas: 'err' } })).rejects.toThrow('Update error');
        });
    });

    describe('remove', () => {
        it('should call remove on the service', async () => {
            mockAppointmentService.remove.mockResolvedValue(undefined);
            await expect(controller.remove(1)).resolves.toBeUndefined();
            expect(mockAppointmentService.remove).toHaveBeenCalledWith(1);
        });

        it('should handle errors', async () => {
            mockAppointmentService.remove.mockRejectedValue(new Error('Delete error'));
            await expect(controller.remove(1)).rejects.toThrow('Delete error');
        });
    });
});