import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  currentUser: Ember.inject.service(),
  store: Ember.inject.service(),
  modalManager: Ember.inject.service(),
  comment: null,
  classNames: ['comment-edit'],

  actions: {
    submitComment() {
      let comment = this.get('store').createRecord('comment', {
        recipeId: this.get('recipeId'),
        posted: moment(),
        text: this.get('commentText'),
        author: {
          username: this.get('currentUser').username,
          name: this.get('currentUser').displayName
        }
      });
      comment.save();
      this.set('commentText', '');
    },

    showLogin() {
      this.get('modalManager').showDialog('Login');
    },

    showSignUp() {
      this.get('modalManager').showDialog('SignUp');
    }
  }

});
