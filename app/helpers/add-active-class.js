import Ember from 'ember';

export function addActiveClass(isActive) {
  return isActive[0] ? "active" : "";
}

export default Ember.Helper.helper(addActiveClass);
