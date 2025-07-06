import { Test, TestingModule } from '@nestjs/testing';
import { AdoptionController } from 'src/adoption/controllers/adoption.controller';
import { AdoptionService } from 'src/adoption/services/adoption.service';
import { CreateAdopcionDto } from 'src/adoption/dto/createAdoption.dto';
import { UpdateAdopcionDto } from 'src/adoption/dto/updateAdoption.dto';
import { Adopcion, EstadoAdopcion } from 'src/adoption/entities/adoption.entity';

describe('AdoptionController', () => {
    let controller: AdoptionController;

    const mockAdoption: Adopcion = {
        idAdopcion: 1,
        fechaAdopcion: new Date(),
        adoptanteId: 'uuid-adoptante',
        mascotaId: 'uuid-mascota',
        responsableRefugioId: 'uuid-responsable',
        estado: EstadoAdopcion.PENDIENTE,
        observaciones: 'Observación de prueba',
    };

    const mockAdoptionService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdoptionController],
            providers: [
                {
                    provide: AdoptionService,
                    useValue: mockAdoptionService,
                },
            ],
        }).compile();

        controller = module.get<AdoptionController>(AdoptionController);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and return a new adoption', async () => {
            mockAdoptionService.create.mockResolvedValue(mockAdoption);
            const dto: CreateAdopcionDto = {
                fechaAdopcion: new Date(),
                adoptanteId: 'uuid-adoptante',
                mascotaId: 'uuid-mascota',
                responsableRefugioId: 'uuid-responsable',
                estado: EstadoAdopcion.PENDIENTE,
                observaciones: 'Observación de prueba',
            };
            const result = await controller.create(dto);
            expect(result).toEqual(mockAdoption);
            expect(mockAdoptionService.create).toHaveBeenCalledWith(dto);
        });

        it('should handle errors', async () => {
            mockAdoptionService.create.mockRejectedValue(new Error('Create error'));
            await expect(controller.create({} as any)).rejects.toThrow('Create error');
        });
    });

    describe('findAll', () => {
        it('should return all adoptions', async () => {
            mockAdoptionService.findAll.mockResolvedValue([mockAdoption]);
            const result = await controller.findAll();
            expect(result).toEqual([mockAdoption]);
            expect(mockAdoptionService.findAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            mockAdoptionService.findAll.mockRejectedValue(new Error('DB error'));
            await expect(controller.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('findOne', () => {
        it('should return an adoption by id', async () => {
            mockAdoptionService.findOne.mockResolvedValue(mockAdoption);
            const result = await controller.findOne(1);
            expect(result).toEqual(mockAdoption);
            expect(mockAdoptionService.findOne).toHaveBeenCalledWith(1);
        });

        it('should handle errors', async () => {
            mockAdoptionService.findOne.mockRejectedValue(new Error('DB error'));
            await expect(controller.findOne(1)).rejects.toThrow('DB error');
        });
    });

    describe('update', () => {
        it('should update and return the adoption', async () => {
            const dto: UpdateAdopcionDto = { observaciones: 'Actualizado' };
            mockAdoptionService.update.mockResolvedValue({ ...mockAdoption, ...dto });
            const result = await controller.update({ id: 1, dto });
            expect(result).toEqual({ ...mockAdoption, ...dto });
            expect(mockAdoptionService.update).toHaveBeenCalledWith(1, dto);
        });

        it('should handle errors', async () => {
            mockAdoptionService.update.mockRejectedValue(new Error('Update error'));
            await expect(controller.update({ id: 1, dto: { observaciones: 'err' } })).rejects.toThrow('Update error');
        });
    });

    describe('remove', () => {
        it('should remove the adoption', async () => {
            mockAdoptionService.remove.mockResolvedValue(undefined);
            await expect(controller.remove(1)).resolves.toBeUndefined();
            expect(mockAdoptionService.remove).toHaveBeenCalledWith(1);
        });

        it('should handle errors', async () => {
            mockAdoptionService.remove.mockRejectedValue(new Error('Delete error'));
            await expect(controller.remove(1)).rejects.toThrow('Delete error');
        });
    });
});