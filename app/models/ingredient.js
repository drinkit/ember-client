import {attr, Model} from 'ember-cli-simple-store/model';
import localize from "../utils/localize";

let map = {
  'Крепкие алкогольные напитки': localize('Крепкие алкогольные напитки',
    'Strong alcoholic drinks', 'Міцні алкогольні напої'),
  'Ликеры': localize('Ликеры', 'Liqueurs', 'Лікери'),
  'Слабоалкогольные напитки': localize('Слабоалкогольные напитки',
    'Low-alcohol drinks', 'Слабоалкогольні напої'),
  'Безалкогольные напитки': localize('Безалкогольные напитки',
    'Non-alcoholic drinks', 'Безалкогольні напої'),
  'Прочее': localize('Прочее', 'Other', 'Інше')
}

export default Model.extend({
  name: attr(),
  vol: attr(),
  description: attr(),
  _category: attr(),
  alias: attr(),

  get category() {
    return map[this._category] || map['Прочее'];
  },

  set category(value) {
    this._category = value;
  }


});
