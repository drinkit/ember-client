import DS from 'ember-data';

export default DS.Model.extend({
  ingredientsWithQuantities: DS.attr(),
  cocktailTypeId: DS.attr('number'),
  description: DS.attr('string'),
  imageUrl: DS.attr('string'),
  name: DS.attr('string'),
  options: DS.attr(),
  published: DS.attr('boolean'),
  thumbnailUrl: DS.attr('string'),
  fullImageUrl: Ember.computed('imageUrl', function() {
  	return 'http://prod-drunkedguru.rhcloud.com' + this.get('imageUrl');
  }),
  fullThumbnailUrl: Ember.computed('thumbnailUrl', function() {
  	return 'http://prod-drunkedguru.rhcloud.com' + this.get('thumbnailUrl');
  }),
});
