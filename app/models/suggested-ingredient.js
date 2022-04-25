import { attr, Model } from 'ember-cli-simple-store/model';

const SuggestedIngredient = Model.extend({
  ingredientId: attr(),
  recipeIds: attr()
});

SuggestedIngredient.reopenClass({
   primaryKey: 'ingredientId'
});

export default SuggestedIngredient;
