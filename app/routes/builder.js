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
      this.set('headData.robots', 'noindex, follow');
    }
  },

  model() {
    let repository = this.get('repository');
    let store = this.get('simpleStore');

    return new Ember.RSVP.hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      allRecipes: repository.find('recipe', {
        url: '/recipes',
        method: 'GET',
        data: {
          criteria: JSON.stringify({
            ingredients: [],
            cocktailTypes: [],
            options: []
          })
        }
      }, 2)
    });
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
    if (controller.get('cocktailTypes.length') > 0 ||
        controller.get('cocktailOptions.length') > 0 ||
        controller.get('selectedIngredientsIds.length') > 0) {
      controller.performSearch();
    }
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
