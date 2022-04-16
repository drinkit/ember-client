import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class IngredientController extends Controller {
  @service repository;
  @service simpleStore;
  @service currentUser;

  get currentIngredient() {
    return this.simpleStore.find('ingredient', this.ingredientId);
  }

  get filteredRecipes() {
    if (this.currentUser.get('role') !== 'ADMIN') {
      return this.suggestedRecipes.filter((item) => item.get('published'));
    }

    return this.suggestedRecipes;
  }
}
