import { Test, TestingModule } from '@nestjs/testing';
import { AnimalService } from 'src/animal/services/animal.service';
import { AnimalController } from 'src/animal/controllers/animal.controller';
import { CreateAnimalDomesticoDto } from 'src/animal/dto/createAnimal.dto';
import { UpdateAnimalDomesticoDto } from 'src/animal/dto/updateAnimal.dto';
import { AnimalDomestico, EspecieMascota, EstadoSalud } from 'src/animal/entities/animal.entity';

describe('AnimalController', () => {
    let controller: AnimalController;

    const mockAnimal: AnimalDomestico = {
        idMascota: 1,
        nombre: 'Firulais',
        especie: EspecieMascota.PERRO,
        raza: 'Labrador',
        edad: 3,
        fechaIngreso: new Date(),
        estadoSalud: EstadoSalud.SANO,
        observaciones: 'Muy juguetón',
    };

    const mockAnimalService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AnimalController],
            providers: [
                {
                    provide: AnimalService,
                    useValue: mockAnimalService,
                },
            ],
        }).compile();

        controller = module.get<AnimalController>(AnimalController);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and return a new animal', async () => {
            mockAnimalService.create.mockResolvedValue(mockAnimal);
            const dto: CreateAnimalDomesticoDto = {
                nombre: 'Firulais',
                especie: EspecieMascota.PERRO,
                raza: 'Labrador',
                edad: 3,
                fechaIngreso: new Date().toISOString(),
                estadoSalud: EstadoSalud.SANO,
                observaciones: 'Muy juguetón',
            };
            const result = await controller.create(dto);
            expect(result).toEqual(mockAnimal);
            expect(mockAnimalService.create).toHaveBeenCalledWith(dto);
        });

        it('should handle errors', async () => {
            mockAnimalService.create.mockRejectedValue(new Error('Create error'));
            await expect(controller.create({} as any)).rejects.toThrow('Create error');
        });
    });

    describe('findAll', () => {
        it('should return all animals', async () => {
            mockAnimalService.findAll.mockResolvedValue([mockAnimal]);
            const result = await controller.findAll();
            expect(result).toEqual([mockAnimal]);
            expect(mockAnimalService.findAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            mockAnimalService.findAll.mockRejectedValue(new Error('DB error'));
            await expect(controller.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('findOne', () => {
        it('should return an animal by id', async () => {
            mockAnimalService.findOne.mockResolvedValue(mockAnimal);
            const result = await controller.findOne(1);
            expect(result).toEqual(mockAnimal);
            expect(mockAnimalService.findOne).toHaveBeenCalledWith(1);
        });

        it('should return null if not found', async () => {
            mockAnimalService.findOne.mockResolvedValue(null);
            const result = await controller.findOne(999);
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockAnimalService.findOne.mockRejectedValue(new Error('DB error'));
            await expect(controller.findOne(1)).rejects.toThrow('DB error');
        });
    });

    describe('update', () => {
        it('should update and return the animal', async () => {
            const dto: UpdateAnimalDomesticoDto = { nombre: 'Nuevo nombre' };
            mockAnimalService.update.mockResolvedValue({ ...mockAnimal, ...dto });
            const result = await controller.update({ id: 1, dto });
            expect(result).toEqual({ ...mockAnimal, ...dto });
            expect(mockAnimalService.update).toHaveBeenCalledWith(1, dto);
        });

        it('should return null if not found', async () => {
            mockAnimalService.update.mockResolvedValue(null);
            const result = await controller.update({ id: 999, dto: { nombre: 'No existe' } });
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockAnimalService.update.mockRejectedValue(new Error('Update error'));
            await expect(controller.update({ id: 1, dto: { nombre: 'err' } })).rejects.toThrow('Update error');
        });
    });

    describe('remove', () => {
        it('should remove the animal', async () => {
            mockAnimalService.remove.mockResolvedValue(undefined);
            await expect(controller.remove(1)).resolves.toBeUndefined();
            expect(mockAnimalService.remove).toHaveBeenCalledWith(1);
        });

        it('should handle errors', async () => {
            mockAnimalService.remove.mockRejectedValue(new Error('Delete error'));
            await expect(controller.remove(1)).rejects.toThrow('Delete error');
        });
    });
});