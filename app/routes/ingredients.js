import Ember from 'ember';

export default Ember.Route.extend({
  repository: Ember.inject.service(),

  model() {
    const repository = this.get('repository');
    return repository.find('ingredient', {
      url: '/ingredients',
      method: 'GET'
    });
  }
});
