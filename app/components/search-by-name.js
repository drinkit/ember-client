import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { scheduleOnce } from '@ember/runloop';

const PossibleTips = ['ром и кола', 'мартини', 'водка + ликер', 'дайкири', 'с соком'];

export default class SearchByName extends Component {
  @service router;
  @tracked randomPlaceholder;

  constructor(owner, args) {
    super(owner, args);
    this.randomPlaceholder = 'Например, ' + PossibleTips[Math.floor(Math.random() * PossibleTips.length)];
  }

  @action
  keyPressed(obj, key) {
    if (!obj.selected && (key.which === 13 || key.keyCode === 13)) {
      this.args.onSearch(obj.searchText);
      document.querySelector('input[type="search"]').blur();
    }
  }

  @action
  clearSearch(select) {
    select.actions.search('');
  }

  @action
  processSearch(term) {
    if (term && term !== "null") {
      this.router.transitionTo(term.route, term.id);
      document.querySelector('input[type="search"]').blur();
    }
  }

  @action
  preventShortSearch(text, select) {
    if (text.length < 3) {
      select.actions.search('');
      return false;
    }
  }

  @action
  preventEmptyOpen(select) {
    if (select.searchText === '') {
      return false;
    }
  }

  @action
  preventHighlight() {
    return null;
  }
}
