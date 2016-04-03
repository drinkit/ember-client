import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
  model(params) {
    this.store.unloadAll('comment');
    this.get('adapterContext').setRecipeId(params.recipe_id);
    return new Ember.RSVP.hash({
      recipe: this.store.findRecord('recipe', params.recipe_id),
      comments: this.store.findAll('comment')
    });
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
  },

  titleToken: function(model) {
    return model.recipe.get('name');
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
