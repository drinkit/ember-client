import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  @service currentUser;
  @service modalManager;
  @service repository;
  @service router;
  @service oauth;

	get filteredSearchableItems() {
		const user = this.get('currentUser');
		let filteredItems = [];
		for (let i = 0; i < this.get('searchableItems').length; i++) {
			if (this.get('searchableItems')[i].groupName === 'Коктейли') {
				let recipes = this.get('searchableItems')[i].options;
				let filteredRecipes = recipes.filter(item => item.published || user.get('role') == 'ADMIN');
				filteredItems.push({groupName: 'Коктейли', options: filteredRecipes});
			} else {
				filteredItems.push(this.get('searchableItems')[i]);
			}
		}

	  return filteredItems;
	}

  get isLoggedIn() {
    return this.currentUser.get('isAuthenticated');
  }

  @action
  showDialog(dialogName) {
    this.modalManager.showDialog(dialogName);
  }

  @action
  hideDialog(dialogName) {
    this.modalManager.hideDialog(dialogName);
  }

  @action
  logout() {
    this.oauth.logout();
  }

  @action
  onSearch(searchString) {
    this.router.transitionTo('recipes', {
      queryParams: {
        search: searchString
      }
    });
  }
}
