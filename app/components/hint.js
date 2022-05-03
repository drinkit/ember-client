import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import {tracked} from "@glimmer/tracking";

export default class Hint extends Component {
  @service hintsManager;

  @tracked wasClosed = false;

  get showHint() {
    return !this.wasClosed && this.hintsManager.needToShowHint(this.args.name);
  }

  @action
  closeHint() {
    this.hintsManager.hintShown(this.args.name);
    this.wasClosed = true;
  }
}
