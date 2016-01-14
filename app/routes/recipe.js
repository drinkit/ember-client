import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('recipe', params.recipe_id);
    },

    didTransiotion: function() {
      this._super(...arguments);
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.get(this, 'metrics').trackPage({document.location.pathname, Ember.get(this, 'model').name});
      })
    }
});
