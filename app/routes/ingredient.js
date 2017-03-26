import Ember from 'ember';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  repository: Ember.inject.service(),

  model(params) {
    const repository = this.get('repository');
    return repository.findOne('ingredient', params.ingredient_id, {
      url: '/ingredients/' + params.ingredient_id,
      method: 'GET'
    });
  },

  afterModel(model) {
    this.set('headData.title', model.get('name') + ' - drinkIt');
    this.set('headData.description', model.description);
  },
});
