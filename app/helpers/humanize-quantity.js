import Ember from 'ember';

export function humanizeQuantity([quantity, unit]) {
  return quantity ? quantity + ' ' + unit : 'немного';
}

export default Ember.Helper.helper(humanizeQuantity);
