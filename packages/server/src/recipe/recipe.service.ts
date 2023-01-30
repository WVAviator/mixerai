import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseException } from '../exceptions/database.exceptions';
import { GenerateService } from '../generate/generate.service';
import { ImageService } from '../image/image.service';
import { User } from '../user/schemas/user.schema';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { RecipeDocument } from './schemas/recipe.schema';

@Injectable()
export class RecipeService {
  private logger = new Logger(RecipeService.name);
  constructor(
    @InjectModel('Recipe') private recipeModel: Model<RecipeDocument>,
    private generateService: GenerateService,
    private imageService: ImageService,
  ) {}

  /**
   * Generates a recipe given the provided prompt and any other options. Generates an image based on the recipe's image prompt description. Saves the recipe to the database.
   * @param param0 The provided prompt and other options
   * @param user The user requesting the created recipe
   * @returns A promise that resolves to a new recipe document after it is saved to the database
   */
  async generate({ prompt }: GenerateRecipeDto, user: User) {
    this.logger.log(`Generating recipe with prompt ${prompt}.`);
    const recipe = await this.generateService.generateRecipe({ prompt });
    const imageUrl = await this.imageService.generateImage({
      prompt: recipe.imagePrompt,
    });
    this.logger.log(`Saving recipe to database.`);
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

  /**
   * Finds all the recipes for a particular user.
   * @param user The user that requested the recipes
   * @returns A promise that resolves to an array of recipe documents from the database
   */
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

  /**
   * Finds a single recipe based on its id.
   * @param id The id of the recipe to find
   * @returns A promise that resolves to a recipe document from the database
   */
  async findOne(id: string) {
    this.logger.log(`Searching for recipe with id ${id}.`);

    let recipe;
    try {
      recipe = await this.recipeModel.findOne({ _id: id });
    } catch (error) {
      throw new DatabaseException('Error finding recipe', {
        cause: error,
      });
    }

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found.`);
    }
    return recipe;
  }

  /**
   * Deletes a recipe from the database and deletes the recipe's image from S3 if the recipe belongs to the user.
   * @param id The id of the recipe to delete
   * @param user The user requesting the deletion
   * @returns A promise that resolves to the deleted recipe document after it is deleted from the database
   */
  async remove(id: string, user: User) {
    const recipe = await this.findOne(id);

    if (recipe.user.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this recipe',
      );
    }
    this.logger.log(`Deleting recipe with id ${id}.`);
    try {
      await recipe.remove();
    } catch (error) {
      throw new DatabaseException('Error deleting recipe', {
        cause: error,
      });
    }

    this.logger.log(`Recipe deleted from database. Deleting image from S3.`);
    this.imageService.deleteImage(recipe.imageUrl);
    return recipe;
  }
}
