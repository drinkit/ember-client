import {inject as service} from '@ember/service';
import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import localize from "../utils/localize";

const PossibleTips = [
  localize('ром и кола', 'rum and cola', 'ром і кола'),
  localize('мартини', 'martini', 'мартіні'),
  localize('водка + ликер', 'vodka + liqueur', 'водка + лікер'),
  localize('дайкири', 'daiquiri', 'дайкірі'),
  localize('с соком', 'with juice', 'з соком'),
];

export default class SearchByName extends Component {
  @service router;
  @tracked randomPlaceholder;

  constructor(owner, args) {
    super(owner, args);
    this.randomPlaceholder = localize('Например', 'For example', 'Наприклад')
      + ", " + PossibleTips[Math.floor(Math.random() * PossibleTips.length)];
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
