import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RememberScrollRoute from "./remember-scroll";
import localize from "../utils/localize";

export default class BuilderRoute extends RememberScrollRoute {
  @service metrics;
  @service headData;
  @service repository;
  @service simpleStore;

  model() {
    let repository = this.get('repository');
    return new hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      allRecipes: repository.find('recipe', {
        url: '/recipes',
        method: 'GET',
        body: {
          criteria: JSON.stringify({
            ingredients: [],
            cocktailTypes: [],
            options: []
          })
        }
      }, 2)
    });
  }

  afterModel(model, transition) {
    if (this.simpleStore.find('foundedRecipe').length === 0) {
      this.simpleStore.pushArray('foundedRecipe', model.allRecipes);
    }

    this.set('headData.title', `${localize('Конструктор коктейлей', 'Cocktail constructor', 'Конструктор коктейлів')} - drinkIt`);
    this.set('headData.description', localize(
      'Конструктор для составления коктейлей. Более 300 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.', // Russian
      'Cocktail constructor. More than 300 recipes, convenient filters, smart search. Saving the bar list and selecting cocktails based on the contents of the bar.', // English
      'Конструктор для складання коктейлів. Більше 300 рецептів, зручні фільтри, розумний пошук. Збереження барного листа і підбір коктейлів за вмістом бару.' // Ukrainian
    ));
    if (transition.to.queryParams && transition.to.queryParams.pageNumber) {
      this.set('headData.robots', 'noindex, follow');
    }
    transition.then(() => {
      this.set('headData.canonical', document.location.origin + document.location.pathname);
    });
  }

  setupController(controller, modelHash) {
    controller.setProperties(modelHash);
  }

  @action
  didTransition() {
    scheduleOnce('afterRender', this, () => {
      const page = "/builder";
      const title = "drinkIt";
      this.metrics.trackPage({
        page,
        title
      });
    });
  }
}
