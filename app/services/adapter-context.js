import Ember from 'ember';

export default Ember.Service.extend({
  // Properties
  recipeId: null,

  // API
  setRecipeId(recipeId) {
    this.set('recipeId', recipeId);
  },

  resetContext() {
    this.set('recipeId', null);
  }
});
