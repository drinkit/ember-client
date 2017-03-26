import Ember from 'ember';

export default Ember.Route.extend({
  repository: Ember.inject.service(),
  headData: Ember.inject.service(),

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
