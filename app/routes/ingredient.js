import Ember from 'ember';

export default Ember.Route.extend({
  repository: Ember.inject.service(),

  model(params) {
    const repository = this.get('repository');
    return repository.findOne('ingredient', params.ingredient_id, {
      url: '/ingredients/' + params.ingredient_id,
      method: 'GET'
    });
  }
});
