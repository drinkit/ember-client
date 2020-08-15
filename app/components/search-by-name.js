import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  classNames: [],
  router: service(),
  possibleTips: ['ром и кола', 'мартини', 'водка + ликер', 'дайкири', 'с соком'],

  init() {
    this._super(...arguments);
    this.set('randomPlaceholder', 'Например, ' + this.get('possibleTips')[Math.floor(Math.random() * this.get('possibleTips').length)]);
  },

  @action
  keyPressed(obj, key) {
    if (!obj.selected && (key.which == 13 || key.keyCode == 13)) {
      this.sendAction('search', obj.searchText);
      document.querySelector('input[type="search"]').blur();
    }
  },

  @action
  processSearch(term) {
    if (term) {
      this.get('router').transitionTo(term.route, term.id);
      document.querySelector('input[type="search"]').blur();
    }
  },

  @action
  preventShortSearch(text, select) {
    if (text.length < 3) {
      select.actions.search('');
      return false;
    }
  },

  @action
  preventEmptyOpen(select) {
    if (select.searchText == '') {
      return false;
    }
  }
});
