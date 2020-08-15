import Service from '@ember/service';

export default Service.extend({
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
