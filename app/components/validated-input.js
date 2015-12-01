import Ember from 'ember';

const {
  computed,
  observer,
  defineProperty,
  run
} = Ember;

export default Ember.Component.extend({
  classNames: ['form-group', 'has-feedback', 'validated-input'],
  classNameBindings: ['isValid:has-success', 'showErrorClass:has-error'],
  isValid: false,
  isInvalid: false,
  model: null,
  value: null,
  rawInputValue: null,
  type: 'text',
  valuePath: '',
  placeholder: '',
  attributeValidation: null,
  isTyping: false,

  didValidate: computed.oneWay('targetObject.didValidate'),

  showErrorClass: computed('isTyping', 'showMessage', 'hasContent', 'attributeValidation', function() {
    return this.get('attributeValidation') && !this.get('isTyping') && this.get('showMessage');
  }),

  hasContent: computed.notEmpty('rawInputValue'),

  isValid: computed.and('hasContent', 'attributeValidation.isValid'),

  isInvalid: computed.oneWay('attributeValidation.isInvalid'),

  inputValueChange: observer('rawInputValue', function() {
    this.set('isTyping', true);
    run.debounce(this, this.setValue, 500, false);
  }),

  showMessage: computed('attributeValidation.isDirty', 'isInvalid', 'didValidate', function() {
    return (this.get('attributeValidation.isDirty') || this.get('didValidate')) && this.get('isInvalid');
  }),

  setValue() {
    this.set('value', this.get('rawInputValue'));
    this.set('isTyping', false);
  },

  init() {
    this._super(...arguments);
    var valuePath = this.get('valuePath');
    defineProperty(this, 'attributeValidation', computed.oneWay(`model.validations.attrs.${valuePath}`));
    this.set('rawInputValue', this.get(`model.${valuePath}`));
    defineProperty(this, 'value', computed.alias(`model.${valuePath}`));
  }
});
