import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseException } from '../exceptions/database.exceptions';
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
      throw new DatabaseException('Error saving recipe', {
        cause: error,
      });
    }
  }

  async findAll(user: User) {
    try {
      const recipes = await this.recipeModel.find({ user: user.id });
      return recipes;
    } catch (error) {
      throw new DatabaseException('Error finding recipes', {
        cause: error,
      });
    }
  }

  async findOne(id: string) {
    try {
      const recipe = await this.recipeModel.findOne({ id });
      return recipe;
    } catch (error) {
      throw new DatabaseException('Error finding recipe', {
        cause: error,
      });
    }
  }

  async remove(id: string, user: User) {
    const recipe = await this.findOne(id);

    if (recipe.user.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this recipe',
      );
    }
    try {
      await recipe.delete();
    } catch (error) {
      throw new DatabaseException('Error deleting recipe', {
        cause: error,
      });
    }
    return recipe;
  }
}
