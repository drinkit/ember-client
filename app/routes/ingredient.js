import Ember from 'ember';

export default Ember.Route.extend({
  headData: Ember.inject.service(),
  repository: Ember.inject.service(),

  model(params) {
    const repository = this.get('repository');
    return new Ember.RSVP.hash({
      ingredients: repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }),
      ingredientId: params.ingredient_id
    });
  },

  setupController: function(controller, modelHash) {
    controller.setProperties(modelHash);
  },

  afterModel(model) {
    const repository = this.get('repository');
    repository.findOne('ingredient', model.ingredientId).then((ingredient) => {
      this.set('headData.title', ingredient.get('name') + ' - drinkIt');
      this.set('headData.description', ingredient.description);
    })
  },
});
