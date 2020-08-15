import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  metrics: service(),
  currentUser: service(),
  repository: service(),
  headData: service(),
  simpleStore: service(),

  afterModel(model) {
    this.set('headData.title', 'Мой бар - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
  },

  beforeModel() {
    const store = this.get('simpleStore');
  },

  model() {
    const repository = this.get('repository');
    const store = this.get('simpleStore');
    return new hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      user: this.get('currentUser'),
      recipes: repository.find('recipe', {
        url: '/recipes',
        method: 'GET',
        body: {
          criteria: JSON.stringify({
            ingredients: [],
            cocktailTypes: [],
            options: []
          })
        }
      })
    });
  },

  setupController: function(controller, modelHash) {
      controller.setProperties(modelHash);
  },

  actions: {
    didTransition: function() {
      scheduleOnce('afterRender', this, () => {
        const page = "/bar";
        const title = "drinkIt";
        this.get('metrics').trackPage({page, title});
      });
    }
  }
});
