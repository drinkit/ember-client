import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class IngredientsRoute extends Route {
  @service repository;
  @service headData;

  model() {
    return this.repository.find('ingredient', {
      url: '/ingredients',
      method: 'GET'
    });
  }

  afterModel(model, transition) {
    this.set('headData.title', 'Ингредиенты - drinkIt');
    this.set('headData.description', 'Конструктор для составления коктейлей. Более 200 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.');
    transition.then(() => {
      this.set('headData.canonical', window.location.href);
    });
  }
}
