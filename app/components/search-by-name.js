import Ember from 'ember';

export default Ember.Component.extend({
  burgerMenu: Ember.inject.service(),
  classNames: ['search-by-name', 'form-group'],
  actions: {
    search: function(value) {
      this.sendAction('search', value);
      $('input[type="search"]').blur();
    },

    searchAsync(term) {
      
    },

    processSearch() {

    }
  }
});
