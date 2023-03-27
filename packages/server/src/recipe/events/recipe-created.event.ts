import { UserDocument } from '../../user/schemas/user.schema';
import { RecipeDocument } from '../schemas/recipe.schema';

export class RecipeCreatedEvent {
  public readonly name = 'recipe.created';
  public readonly timestamp = Date.now();
  public readonly recipeDocument;
  public readonly userDocument;

  constructor(recipeDocument: RecipeDocument, userDocument: UserDocument) {
    this.recipeDocument = recipeDocument;
    this.userDocument = userDocument;
  }
}
