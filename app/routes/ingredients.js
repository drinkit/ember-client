import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  repository: service(),
  headData: service(),

  model() {
    const repository = this.get('repository');
    return repository.find('ingredient', {
      url: '/ingredients',
      method: 'GET'
    });
  },

  afterModel(model) {
    this.set('headData.title', 'Ингредиенты - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
  },
});
