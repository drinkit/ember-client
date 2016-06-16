import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
  model(params) {
    this.store.unloadAll('comment');
    this.get('adapterContext').setRecipeId(params.recipe_id);
    let comments = this.store.findAll('comment').then((comments) => {
      return comments;
    }, (response) => {
      return null;
    });
    return new Ember.RSVP.hash({
      recipe: this.store.findRecord('recipe', params.recipe_id),
      comments: comments
    });
  },

  headData: Ember.inject.service(),

  afterModel(model) {
    this.set('headData.title', 'drinkIt - ' + model.recipe.get('name'));
    this.set('headData.description', Ember.String.htmlSafe(model.recipe.get('description')));
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
    }
  }
});
