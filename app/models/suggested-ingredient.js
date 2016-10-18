import { attr, Model } from 'ember-cli-simple-store/model';

var SuggestedIngredient = Model.extend({
  ingredientId: attr(),
  recipeIds: attr()
});

SuggestedIngredient.reopenClass({
   primaryKey: 'ingredientId'
});

export default SuggestedIngredient;
