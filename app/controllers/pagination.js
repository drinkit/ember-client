import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class PaginationController extends Controller {
  queryParams = ['pageNumber'];
  @tracked pageNumber = 0;
  @tracked pageSize = 16;

  init(...args) {
    super.init(...args);
    this.addObserver('pageNumber', () => {
      this.scrollOnPageChange();
    });
  }

  get scrollOffset() {
    return 0;
  }

  scrollOnPageChange() {
    window.scrollTo(0, this.scrollOffset);
  }

  get recipes() {
    return null;
  }

  get foundCocktails() {
    return this.recipes && this.recipes.length > 0;
  }

  get nextPageNumber() {
    return this.pageNumber + 1;
  }

  get previousPageNumber() {
    return this.pageNumber - 1;
  }

  get isNextPageExist() {
    return this.pageNumber + 1 < this.pages.length;
  }

  get isPreviousPageExist() {
    return this.pageNumber - 1 >= 0 && this.pages.length > 0;
  }

  get pages() {
    const pages = [];
    const that = this;
    if (this.recipes != null) {
      const allRecipes = this.recipes;
      let index = 0;
      let curPageIndex = 0;
      while (index < allRecipes.get('length')) {
        const page = [];
        while (index < (curPageIndex + 1) * that.get('pageSize') && index < allRecipes.get('length')) {
          page.push(allRecipes.objectAt(index));
          index++;
        }
        pages.push(page);
        curPageIndex++;
      }
    }
    return pages;
  }

  get recipesOnPage() {
    return this.pages[this.pageNumber];
  }
}
