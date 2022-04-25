import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class ValidatedInput extends Component {
  @tracked showValidations = false;

  get validation() {
    return this.args.model.validations.attrs[this.args.valuePath];
  }

  get value() {
    return this.args.model[this.args.valuePath];
  }

  get notValidating() {
    return !this.validation.isValidating;
  }

  get hasContent() {
    return !!this.value;
  }

  get hasWarnings() {
    return this.validation.warnings.length > 0;
  }

  get isValid() {
    return this.hasContent && this.validation.isTruelyValid;
  }

  get shouldDisplayValidations() {
    return this.showValidations || this.args.didValidate || this.hasContent;
  }

  get showErrorClass() {
    return this.notValidating && this.showErrorMessage && this.hasContent && this.validation;
  }

  get showErrorMessage() {
    return this.shouldDisplayValidations && this.validation.isInvalid;
  }

  get showWarningMessage() {
    return this.shouldDisplayValidations && this.hasWarnings && this.isValid;
  }

  focusOut() {
    super.focusOut();
    this.showValidations = true;
  }
}
