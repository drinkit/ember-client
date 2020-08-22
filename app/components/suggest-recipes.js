import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['px-15px'],
  maxRecipes: 6,
  initialized: false,
  suggestedRecipes: [],

  filteredSuggestedRecipes: computed('suggestedRecipes.[]', function() {
    return this.get('suggestedRecipes') ? this.get('suggestedRecipes').slice(0, this.get('maxRecipes')) : [];
  }),

  hasData: computed('filteredSuggestedRecipes.[]', function() {
    return this.get('filteredSuggestedRecipes.length') > 0;
  })
});
