import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from 'src/appointment/services/appointment.service';
import { Appointment, EstadoCita } from 'src/appointment/entities/appointment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AppointmentService', () => {
    let service: AppointmentService;
    let repo: Repository<Appointment>;

    const mockAppointment: Appointment = {
        idCita: 1,
        fechaHora: new Date(),
        adoptanteId: 'uuid-adoptante',
        mascotaId: 'uuid-mascota',
        responsableRefugioId: 'uuid-responsable',
        estado: EstadoCita.PENDIENTE,
        notas: 'Nota de prueba',
    };

    const mockRepo = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentService,
                {
                    provide: getRepositoryToken(Appointment),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<AppointmentService>(AppointmentService);
        repo = module.get<Repository<Appointment>>(getRepositoryToken(Appointment));
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all appointments', async () => {
            mockRepo.find.mockResolvedValue([mockAppointment]);
            const result = await service.findAll();
            expect(result).toEqual([mockAppointment]);
            expect(mockRepo.find).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            mockRepo.find.mockRejectedValue(new Error('DB error'));
            await expect(service.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('findOne', () => {
        it('should return an appointment by id', async () => {
            mockRepo.findOne.mockResolvedValue(mockAppointment);
            const result = await service.findOne(1);
            expect(result).toEqual(mockAppointment);
            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { idCita: 1 } });
        });

        it('should return null if not found', async () => {
            mockRepo.findOne.mockResolvedValue(null);
            const result = await service.findOne(999);
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockRepo.findOne.mockRejectedValue(new Error('DB error'));
            await expect(service.findOne(1)).rejects.toThrow('DB error');
        });
    });

    describe('create', () => {
        it('should create and return a new appointment', async () => {
            mockRepo.create.mockReturnValue(mockAppointment);
            mockRepo.save.mockResolvedValue(mockAppointment);
            const result = await service.create(mockAppointment as any);
            expect(result).toEqual(mockAppointment);
            expect(mockRepo.create).toHaveBeenCalledWith(mockAppointment);
            expect(mockRepo.save).toHaveBeenCalledWith(mockAppointment);
        });

        it('should handle errors', async () => {
            mockRepo.save.mockRejectedValue(new Error('Create error'));
            await expect(service.create(mockAppointment as any)).rejects.toThrow('Create error');
        });
    });

    describe('update', () => {
        it('should update and return the appointment', async () => {
            mockRepo.update.mockResolvedValue({ affected: 1 });
            mockRepo.findOne.mockResolvedValue({ ...mockAppointment, notas: 'Actualizado' });
            const result = await service.update(1, { notas: 'Actualizado' });
            expect(result).toEqual({ ...mockAppointment, notas: 'Actualizado' });
            expect(mockRepo.update).toHaveBeenCalledWith(1, { notas: 'Actualizado' });
        });

        it('should return null if not found', async () => {
            mockRepo.update.mockResolvedValue({ affected: 0 });
            const result = await service.update(999, { notas: 'No existe' });
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockRepo.update.mockRejectedValue(new Error('Update error'));
            await expect(service.update(1, { notas: 'err' })).rejects.toThrow('Update error');
        });
    });

    describe('remove', () => {
        it('should remove the appointment', async () => {
            mockRepo.delete.mockResolvedValue({ affected: 1 });
            await expect(service.remove(1)).resolves.toBeUndefined();
            expect(mockRepo.delete).toHaveBeenCalledWith(1);
        });

        it('should handle errors', async () => {
            mockRepo.delete.mockRejectedValue(new Error('Delete error'));
            await expect(service.remove(1)).rejects.toThrow('Delete error');
        });
    });
});