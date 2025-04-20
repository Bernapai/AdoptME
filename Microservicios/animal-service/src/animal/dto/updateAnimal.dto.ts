import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimalDomesticoDto } from './createAnimal.dto';

export class UpdateAnimalDomesticoDto extends PartialType(
  CreateAnimalDomesticoDto,
) { }
