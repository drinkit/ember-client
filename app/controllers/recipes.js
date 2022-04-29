import PaginationController from "./pagination";
import { tracked } from '@glimmer/tracking';

export default class RecipesController extends PaginationController {
  queryParams = ['pageNumber', 'search'];
  @tracked search = null;


  get recipes() {
    return this.allRecipes;
  }
}
