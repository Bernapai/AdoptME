import { Test, TestingModule } from '@nestjs/testing';
import { AdoptionService } from 'src/adoption/services/adoption.service';
import { Adopcion, EstadoAdopcion } from 'src/adoption/entities/adoption.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AdoptionService', () => {
    let service: AdoptionService;
    let repo: Repository<Adopcion>;

    const mockAdoption: Adopcion = {
        idAdopcion: 1,
        fechaAdopcion: new Date(),
        adoptanteId: 'uuid-adoptante',
        mascotaId: 'uuid-mascota',
        responsableRefugioId: 'uuid-responsable',
        estado: EstadoAdopcion.PENDIENTE,
        observaciones: 'Observación de prueba',
    };

    const mockRepo = {
        find: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdoptionService,
                {
                    provide: getRepositoryToken(Adopcion),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<AdoptionService>(AdoptionService);
        repo = module.get<Repository<Adopcion>>(getRepositoryToken(Adopcion));
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all adoptions', async () => {
            mockRepo.find.mockResolvedValue([mockAdoption]);
            const result = await service.findAll();
            expect(result).toEqual([mockAdoption]);
            expect(mockRepo.find).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            mockRepo.find.mockRejectedValue(new Error('DB error'));
            await expect(service.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('findOne', () => {
        it('should return an adoption by id', async () => {
            mockRepo.findOneBy.mockResolvedValue(mockAdoption);
            const result = await service.findOne(1);
            expect(result).toEqual(mockAdoption);
            expect(mockRepo.findOneBy).toHaveBeenCalledWith({ idAdopcion: 1 });
        });

        it('should throw if not found', async () => {
            mockRepo.findOneBy.mockResolvedValue(null);
            await expect(service.findOne(999)).rejects.toThrow('Adopcion with id 999 not found');
        });

        it('should handle errors', async () => {
            mockRepo.findOneBy.mockRejectedValue(new Error('DB error'));
            await expect(service.findOne(1)).rejects.toThrow('DB error');
        });
    });

    describe('create', () => {
        it('should create and return a new adoption', async () => {
            mockRepo.create.mockReturnValue(mockAdoption);
            mockRepo.save.mockResolvedValue(mockAdoption);
            const result = await service.create(mockAdoption as any);
            expect(result).toEqual(mockAdoption);
            expect(mockRepo.create).toHaveBeenCalledWith(mockAdoption);
            expect(mockRepo.save).toHaveBeenCalledWith(mockAdoption);
        });

        it('should handle errors', async () => {
            mockRepo.save.mockRejectedValue(new Error('Create error'));
            await expect(service.create(mockAdoption as any)).rejects.toThrow('Create error');
        });
    });

    describe('update', () => {
        it('should update and return the adoption', async () => {
            mockRepo.update.mockResolvedValue({ affected: 1 });
            mockRepo.findOneBy.mockResolvedValue({ ...mockAdoption, observaciones: 'Actualizado' });
            const result = await service.update(1, { observaciones: 'Actualizado' });
            expect(result).toEqual({ ...mockAdoption, observaciones: 'Actualizado' });
            expect(mockRepo.update).toHaveBeenCalledWith(1, { observaciones: 'Actualizado' });
        });

        it('should handle errors', async () => {
            mockRepo.update.mockRejectedValue(new Error('Update error'));
            await expect(service.update(1, { observaciones: 'err' })).rejects.toThrow('Update error');
        });
    });

    describe('remove', () => {
        it('should remove the adoption', async () => {
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