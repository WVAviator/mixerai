import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { User } from '../user/user.decorator';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  generate(
    @Body() generateRecipeDto: GenerateRecipeDto,
    @User() user: UserDocument,
  ) {
    return this.recipeService.generate(generateRecipeDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@User() user: UserDocument) {
    return this.recipeService.findAll(user);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @User() user: UserDocument) {
    return this.recipeService.remove(id, user);
  }
}
