import Ember from 'ember';

export default Ember.Component.extend({
  currentUser: Ember.inject.service(),
  comment: null
});
