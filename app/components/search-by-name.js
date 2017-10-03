import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['search-by-name', 'form-group'],
  router: Ember.inject.service(),

  actions: {
    keyPressed: function(obj, key) {
      if (!obj.selected && (key.which == 13 || key.keyCode == 13)) {
        this.sendAction('search', obj.searchText);
        $('input[type="search"]').blur();
      }
    },

    searchAsync(term) {

    },

    processSearch(term) {
      if (term) {
        this.get('router').transitionTo(term.route, term.id);
      }
    },

    preventShortSearch(text, select) {
      if (text.length < 3) {
        select.actions.search('');
        return false;
      }
    }
  }
});
