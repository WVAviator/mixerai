import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenerateService } from '../generate/generate.service';
import { ImageService } from '../image/image.service';
import { User } from '../user/schemas/user.schema';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeDocument } from './schemas/recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel('Recipe') private recipeModel: Model<RecipeDocument>,
    private generateService: GenerateService,
    private imageService: ImageService,
  ) {}

  async generate({ prompt }: GenerateRecipeDto, user: User) {
    const recipe = await this.generateService.generateRecipe({ prompt });
    const imageUrl = await this.imageService.generateImage({
      prompt: recipe.imagePrompt,
    });
    try {
      const recipeData = await this.recipeModel.create({
        ...recipe,
        imageUrl,
        prompt,
        user,
      });
      recipeData.save();
      return recipeData;
    } catch (error) {
      throw new InternalServerErrorException('Error saving recipe', {
        cause: error,
      });
    }
  }

  findAll() {
    return `This action returns all recipe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
