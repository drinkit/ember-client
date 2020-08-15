import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Route.extend(RememberScrollMixin, {
  simpleStore: service(),
  repository: service(),

  beforeModel() {
    const store = this.get('simpleStore');
    store.clear('comment');
  },

  model(params) {
    const repository = this.get('repository');

    return new hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      recipe: repository.findOne('recipe', params.recipe_id, {
        url: '/recipes/' + params.recipe_id,
        method: 'GET'
      }),
      comments: repository.find('comment', {
        url: '/recipes/' + params.recipe_id + '/comments',
        method: 'GET'
      })
    });
  },

  headData: service(),

  afterModel(model) {
    this.set('headData.title', 'Рецепт коктейля «' + model.recipe.get('name') + '» - drinkIt');
    this.set('headData.description', htmlSafe(model.recipe.get('description')));
    this.set('headData.image', model.recipe.get('fullImageUrl'));
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
  },

  metrics: service(),
  stats: service(),
  adapterContext: service(),

  actions: {
    didTransition() {
      scheduleOnce('afterRender', this, () => {
        const page = document.location.pathname;
        const title = this.get('currentModel').recipe.get('name');
        get(this, 'metrics').trackPage({
          page,
          title
        });
        this.get('stats').incrementViewsCount(this.get('currentModel').recipe.get('id'));
      });
    },

    error(error, transition) {
      if (error && error.status === 404) {
        this.transitionTo('/error404');
      }
    }
  }
});
