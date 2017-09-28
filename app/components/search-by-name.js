import Ember from 'ember';

export default Ember.Component.extend({
  burgerMenu: Ember.inject.service(),
  classNames: ['search-by-name', 'form-group'],
  actions: {
    keyPressed: function(obj, key) {
      if (key.which == 13 || key.keyCode == 13) {
        this.sendAction('search', obj.searchText);
        $('input[type="search"]').blur();
      }
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
