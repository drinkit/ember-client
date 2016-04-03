import DS from 'ember-data';

export default DS.Model.extend({
  recipeId: DS.attr('number'),
  posted: DS.attr('utc'),
  text: DS.attr('string'),
  author: DS.attr()
});
