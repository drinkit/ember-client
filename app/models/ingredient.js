import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  vol: DS.attr('number'),
  description: DS.attr('string'),
  category: DS.attr('string')
});
