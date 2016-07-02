import { attr, Model } from 'ember-cli-simple-store/model';

export default Model.extend({
  recipeId: attr(),
  posted: attr(),
  text: attr(),
  author: attr()
});
