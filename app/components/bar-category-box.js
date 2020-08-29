import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class BarCategoryBox extends Component {
  @action
  removeItem(item) {
    this.args.onRemoveItem(item);
  }
};
