import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  repository: Ember.inject.service(),
  headData: Ember.inject.service(),
  simpleStore: Ember.inject.service(),

  afterModel(model) {
    this.set('headData.title', 'Мой бар - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
  },

  beforeModel() {
    const store = this.get('simpleStore');
    store.clear('recipe');
  },

  model() {
    const repository = this.get('repository');
    const store = this.get('simpleStore');
    return new Ember.RSVP.hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      user: this.get('currentUser'),
      recipes: repository.find('recipe', {
        url: '/recipes?criteria={"ingredients":[],"cocktailTypes":[],"options":[]}',
        method: 'GET'
      })
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
