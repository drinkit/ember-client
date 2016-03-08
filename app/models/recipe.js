import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  ingredientsWithQuantities: DS.attr(),
  cocktailTypeId: DS.attr('number'),
  description: DS.attr('string'),
  imageUrl: DS.attr('string'),
  name: DS.attr('string'),
  options: DS.attr(),
  published: DS.attr('boolean'),
  thumbnailUrl: DS.attr('string'),
  views: DS.attr('number'),
  likes: DS.attr('number'),
  fullImageUrl: Ember.computed('imageUrl', function() {
  	return 'http://prod-drunkedguru.rhcloud.com' + this.get('imageUrl');
  }),
  fullThumbnailUrl: Ember.computed('thumbnailUrl', function() {
  	return 'http://prod-drunkedguru.rhcloud.com' + this.get('thumbnailUrl');
  }),
});
