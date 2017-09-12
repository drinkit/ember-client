import Ember from 'ember';

export default Ember.Component.extend({
  burgerMenu: Ember.inject.service(),
  classNames: ['search-by-name', 'form-group'],
  actions: {
    search: function(value) {
      // this.sendAction('search', value);
      // $('input[type="search"]').blur();
    },

    searchAsync(term) {

    },

    processSearch(term) {

    },

    preventShortSearch(text, select) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
    }
  }
});
