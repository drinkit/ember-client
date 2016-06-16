import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  currentUser: Ember.inject.service(),

  headData: Ember.inject.service(),

  afterModel(model) {
    this.set('headData.title', 'drinkIt - Мой бар');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
  },

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
