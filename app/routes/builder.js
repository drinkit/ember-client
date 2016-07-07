import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
  metrics: Ember.inject.service(),
  headData: Ember.inject.service(),
  repository: Ember.inject.service(),
  simpleStore: Ember.inject.service(),

  afterModel() {
    this.set('headData.title', 'Конструктор коктейлей - drinkIt');
		this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
  },

  model() {
    let store = this.get('simpleStore');
    let repository = this.get('repository');
    return new Ember.RSVP.hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      recipes: store.find('recipe')
    });
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
    controller.performSearch();
  },

  actions: {
    didTransition: function() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        const page = "/builder";
        const title = "drinkIt";
        this.get('metrics').trackPage({
          page,
          title
        });
      });
    }
  }
});
