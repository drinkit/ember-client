/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import { oneWay, alias, not, notEmpty, and } from '@ember/object/computed';

import Component from '@ember/component';
import { defineProperty, computed } from '@ember/object';

export default Component.extend({
  classNames: ['relative'],
  classNameBindings: ['showErrorClass:has-error', 'isValid:has-success'],
  model: null,
  value: null,
  type: 'text',
  valuePath: '',
  placeholder: '',
  validation: null,
  isTyping: false,

  init() {
    this._super(...arguments);
    var valuePath = this.get('valuePath');
    defineProperty(this, 'validation', oneWay(`model.validations.attrs.${valuePath}`));
    defineProperty(this, 'value', alias(`model.${valuePath}`));
  },

  notValidating: not('validation.isValidating'),
  didValidate: oneWay('targetObject.didValidate'),
  hasContent: notEmpty('value'),
  isValid: and('hasContent', 'validation.isValid', 'notValidating'),
  isInvalid: oneWay('validation.isInvalid'),
  showErrorClass: and('notValidating', 'showMessage', 'hasContent', 'validation'),
  showMessage: computed('validation.isDirty', 'isInvalid', 'didValidate', function() {
    return (this.get('validation.isDirty') || this.get('didValidate')) && this.get('isInvalid');
  })
});
