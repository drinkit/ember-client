import { scheduleOnce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import localize from "../utils/localize";

export default class RecipeRoute extends Route {
  @service simpleStore;
  @service repository;
  @service headData;
  @service metrics;
  @service stats;
  @service router;

  beforeModel() {
    this.simpleStore.clear('comment');
  };

  model(params) {
    return new hash({
      ingredients: this.repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      recipe: this.repository.findOne('recipe', params.recipe_id, {
        url: '/recipes/' + params.recipe_id,
        method: 'GET'
      }),
      recipeId: params.recipe_id
    });
  }

  afterModel(model, transition) {
    this.set('headData.title', `${localize('Рецепт коктейля', 'Cocktail recipe', 'Рецепт коктейлю')} «` + model.recipe.get('name') + '» - drinkIt');
    this.set('headData.description', htmlSafe(model.recipe.get('description')));
    this.set('headData.image', model.recipe.get('fullImageUrl'));
    transition.then(() => {
      this.set('headData.canonical', document.location.origin + document.location.pathname);
    });
  }

  setupController(controller, modelHash) {
    controller.setProperties(modelHash);
    controller.set('comments', null);
    this.requestComments(modelHash.recipeId).then((response) => {
      controller.set('comments', response);
    });
  }

  requestComments(id) {
    return this.repository.find('comment', {
      url: '/recipes/' + id + '/comments',
      method: 'GET'
    });
  }

  @action
  didTransition() {
    scheduleOnce('afterRender', this, () => {
      const page = document.location.pathname;
      const title = this.get('currentModel').recipe.get('name');
      this.metrics.trackPage({
        page,
        title
      });
      this.stats.incrementViewsCount(this.get('currentModel').recipe.get('id'));
    });
  }

  activate() {
    window.scrollTo(0, 0);
  }

  @action
  error(error, transition) {
    if (error && error.status === 404) {
      this.transitionTo('/error404');
    }
  }
}
