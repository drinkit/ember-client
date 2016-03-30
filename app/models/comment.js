import DS from 'ember-data';

export default DS.Model.extend({
  recipeId: DS.attr('number'),
  posted: DS.attr('date'),
  text: DS.attr('string'),
  author: DS.attr()
});
