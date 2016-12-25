import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
  metrics: Ember.inject.service(),
  headData: Ember.inject.service(),
  repository: Ember.inject.service(),
  simpleStore: Ember.inject.service(),

  afterModel(model, transition) {
    this.set('headData.title', 'Конструктор коктейлей - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
    if (transition.queryParams && transition.queryParams.pageNumber) {
      let prevPageNumber = parseInt(transition.queryParams.pageNumber) - 1
      if (prevPageNumber > 0) {
        this.set('headData.prevPageLink', '?pageNumber=' + prevPageNumber);
      } else {
        this.set('headData.prevPageLink', '/');
      }
    }
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
