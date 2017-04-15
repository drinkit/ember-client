import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['suggest-recipes'],
  maxRecipes: 6,
  initialized: false,
  suggestedRecipes: [],

  filteredSuggestedRecipes: Ember.computed('suggestedRecipes.[]', function() {
    return this.get('suggestedRecipes') ? this.get('suggestedRecipes').slice(0, this.get('maxRecipes')) : [];
  }),

  hasData: Ember.computed('filteredSuggestedRecipes.[]', function() {
    return this.get('filteredSuggestedRecipes.length') > 0;
  })
});
