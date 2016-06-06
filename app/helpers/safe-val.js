import Ember from 'ember';

export function safeVal([value, defaultValue]) {
  return value || defaultValue;
}

export default Ember.Helper.helper(safeVal);
