import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateService {
  generateRecipe() {
    return 'This action adds a new recipe';
  }
}
