import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class IngredientRoute extends Route {
  @service headData;
  @service repository;
  @service metrics;
  @service simpleStore;

  beforeModel() {
    this.simpleStore.clear('suggestedRecipe');
  }

  model(params) {
    return new hash({
      ingredients: this.repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      ingredientId: params.ingredient_id
    });
  }

  setupController(controller, modelHash) {
    controller.setProperties(modelHash);
    this.get('repository').find('suggestedRecipe', {
      url: '/recipes',
      method: 'GET',
      body: {
        criteria: JSON.stringify({
          ingredients: [modelHash.ingredientId],
          cocktailTypes: [],
          options: []
        })
      }
    }).then((response) => {
      controller.set('suggestedRecipesInitialized', true);
      controller.set('suggestedRecipes', response);
    });
  }

  afterModel(model, transition) {
    const repository = this.get('repository');
    repository.findOne('ingredient', model.ingredientId).then((ingredient) => {
      this.set('headData.title', ingredient.get('name') + ' - drinkIt');
      this.set('headData.description', ingredient.get('description'));
    });

    transition.then(() => {
      this.set('headData.canonical', window.location.href);
    });
  }

  activate() {
    window.scrollTo(0, 0);
  }


  @action
  didTransition() {
    this.repository.findOne('ingredient', this.currentModel.ingredientId).then((ingredient) => {
      scheduleOnce('afterRender', this, () => {
        const page = document.location.pathname;
        const title = ingredient.get('name');
        get(this, 'metrics').trackPage({
          page,
          title
        });
      });
    });
  }

  @action
  error(error, transition) {
    if (error && error.status === 404) {
      this.transitionTo('/error404');
    }
  }
}
