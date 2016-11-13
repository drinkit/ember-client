import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
  simpleStore: Ember.inject.service(),
  repository: Ember.inject.service(),

  beforeModel() {
    const store = this.get('simpleStore');
    store.clear('comment');
  },

  model(params) {
    const store = this.get('simpleStore');
    const repository = this.get('repository');

    return new Ember.RSVP.hash({
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

  headData: Ember.inject.service(),

  afterModel(model) {
    this.set('headData.title', 'Рецепт коктейля «'model.recipe.get('name') + '» - drinkIt');
    this.set('headData.description', Ember.String.htmlSafe(model.recipe.get('description')));
    this.set('headData.image', model.recipe.get('fullThumbnailUrl'));
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
  },

  metrics: Ember.inject.service(),
  stats: Ember.inject.service(),
  adapterContext: Ember.inject.service(),

  actions: {
    didTransition: function() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        const page = document.location.pathname;
        const title = this.get('currentModel').recipe.get('name');
        Ember.get(this, 'metrics').trackPage({
          page,
          title
        });
        this.get('stats').incrementViewsCount(this.get('currentModel').recipe.get('id'));
      });
    },

    error(error, transition) {
      if (error && error.status == 404) {
        this.transitionTo('/error404');
      }
    }
  }
});
