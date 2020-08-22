import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  headData: service(),
  repository: service(),
  metrics: service(),

  model(params) {
    const repository = this.get('repository');
    return new hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      ingredientId: params.ingredient_id
    });
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
  },

  afterModel(model) {
    const repository = this.get('repository');
    repository.findOne('ingredient', model.ingredientId).then((ingredient) => {
      this.set('headData.title', ingredient.get('name') + ' - drinkIt');
      this.set('headData.description', ingredient.get('description'));
    });
  },

  actions: {
    didTransition() {
      const repository = this.get('repository');
      repository.findOne('ingredient', this.get('currentModel').ingredientId).then((ingredient) => {
        scheduleOnce('afterRender', this, () => {
          const page = document.location.pathname;
          const title = ingredient.get('name');
          get(this, 'metrics').trackPage({
            page,
            title
          });
        });
      });
    },

    error(error, transition) {
      if (error && error.status === 404) {
        this.transitionTo('/error404');
      }
    }
  }
});
