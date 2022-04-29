import { computed } from '@ember/object';
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
  fullImageUrl: computed('imageUrl', function() {
    return this.get('imageUrl');
  }),
  fullThumbnailUrl: computed('thumbnailUrl', function() {
    return this.get('thumbnailUrl');
  })
});
