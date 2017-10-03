import { attr, Model } from 'ember-cli-simple-store/model';
import ENV from 'ember-drink-it/config/environment';

export default Model.extend({
  ingredientsWithQuantities: attr(),
  cocktailTypeId: attr(),
  description: attr(),
  imageUrl: attr(),
  name: attr(),
  originalName: attr(),
  options: attr(),
  published: attr(),
  thumbnailUrl: attr(),
  stats: attr(),
  fullImageUrl: Ember.computed('imageUrl', function() {
    return ENV['server-path']+ this.get('imageUrl');
  }),
  fullThumbnailUrl: Ember.computed('thumbnailUrl', function() {
    return ENV['server-path'] + this.get('thumbnailUrl');
  })
});
