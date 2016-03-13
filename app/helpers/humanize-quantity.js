import Ember from 'ember';

export function humanizeQuantity([quantity]) {
  return quantity ? quantity + ' мл' : 'немного';
}

export default Ember.Helper.helper(humanizeQuantity);
