import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  currentUser: Ember.inject.service(),

  titleToken: 'Мой бар',

  model() {
    return new Ember.RSVP.hash({
      ingredients: this.store.findAll('ingredient'),
      user: this.get('currentUser')
    });
  },

  setupController: function(controller, modelHash) {
      controller.setProperties(modelHash);
  },

  actions: {
    didTransition: function() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        const page = "/bar";
        const title = "drinkIt";
        this.get('metrics').trackPage({page, title});
      });
    }
  }
});
