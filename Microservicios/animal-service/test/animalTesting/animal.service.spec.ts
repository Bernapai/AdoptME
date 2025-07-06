import { Test, TestingModule } from '@nestjs/testing';
import { AnimalService } from 'src/animal/services/animal.service';
import { AnimalDomestico, EspecieMascota, EstadoSalud } from 'src/animal/entities/animal.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AnimalService', () => {
    let service: AnimalService;
    let repo: Repository<AnimalDomestico>;

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
                AnimalService,
                {
                    provide: getRepositoryToken(AnimalDomestico),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<AnimalService>(AnimalService);
        repo = module.get<Repository<AnimalDomestico>>(getRepositoryToken(AnimalDomestico));
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all animals', async () => {
            mockRepo.find.mockResolvedValue([mockAnimal]);
            const result = await service.findAll();
            expect(result).toEqual([mockAnimal]);
            expect(mockRepo.find).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            mockRepo.find.mockRejectedValue(new Error('DB error'));
            await expect(service.findAll()).rejects.toThrow('DB error');
        });
    });

    describe('findOne', () => {
        it('should return an animal by id', async () => {
            mockRepo.findOne.mockResolvedValue(mockAnimal);
            const result = await service.findOne(1);
            expect(result).toEqual(mockAnimal);
            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { idMascota: 1 } });
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
        it('should create and return a new animal', async () => {
            mockRepo.create.mockReturnValue(mockAnimal);
            mockRepo.save.mockResolvedValue(mockAnimal);
            const result = await service.create(mockAnimal as any);
            expect(result).toEqual(mockAnimal);
            expect(mockRepo.create).toHaveBeenCalledWith(mockAnimal);
            expect(mockRepo.save).toHaveBeenCalledWith(mockAnimal);
        });

        it('should handle errors', async () => {
            mockRepo.save.mockRejectedValue(new Error('Create error'));
            await expect(service.create(mockAnimal as any)).rejects.toThrow('Create error');
        });
    });

    describe('update', () => {
        it('should update and return the animal', async () => {
            mockRepo.update.mockResolvedValue({ affected: 1 });
            mockRepo.findOne.mockResolvedValue({ ...mockAnimal, nombre: 'Nuevo nombre' });
            const result = await service.update(1, { nombre: 'Nuevo nombre' });
            expect(result).toEqual({ ...mockAnimal, nombre: 'Nuevo nombre' });
            expect(mockRepo.update).toHaveBeenCalledWith(1, { nombre: 'Nuevo nombre' });
        });

        it('should return null if not found', async () => {
            mockRepo.update.mockResolvedValue({ affected: 0 });
            const result = await service.update(999, { nombre: 'No existe' });
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            mockRepo.update.mockRejectedValue(new Error('Update error'));
            await expect(service.update(1, { nombre: 'err' })).rejects.toThrow('Update error');
        });
    });

    describe('remove', () => {
        it('should remove the animal', async () => {
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