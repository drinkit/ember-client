import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('recipe', params.recipe_id);
    },

    metrics: Ember.inject.service(),

    actions: {
      didTransition: function() {
        Ember.run.scheduleOnce('afterRender', this, () => {
          const page = document.location.pathname;
          const title = this.get('currentModel').get('name');

          Ember.get(this, 'metrics').trackPage({ page, title });
        });
      }
    }
});
