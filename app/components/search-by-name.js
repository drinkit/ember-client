import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['search-by-name', 'form-group'],
  router: Ember.inject.service(),
  possibleTips: ['ром и кола', 'мартини', 'водка + ликер', 'дайкири', 'с соком'],

  init() {
    this._super(...arguments);
    this.set('randomPlaceholder', 'Например, ' + this.get('possibleTips')[Math.floor(Math.random() * this.get('possibleTips').length)]);
  },

  actions: {
    keyPressed: function(obj, key) {
      if (!obj.selected && (key.which == 13 || key.keyCode == 13)) {
        this.sendAction('search', obj.searchText);
        $('input[type="search"]').blur();
      }
    },

    processSearch(term) {
      if (term) {
        this.get('router').transitionTo(term.route, term.id);
        $('input[type="search"]').blur();
      }
    },

    preventShortSearch(text, select) {
      if (text.length < 3) {
        select.actions.search('');
        return false;
      }
    },

    preventEmptyOpen(select) {
      if (select.searchText == '') {
        return false;
      }
    }
  }
});
