import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
  modalManager: Ember.inject.service(),
  simpleStore: Ember.inject.service(),
  comment: null,
  classNames: ['comment-edit'],

  actions: {
    submitComment() {
      const store = this.get('simpleStore');
      const ajax = this.get('ajax');

      let comment = {
        recipeId: this.get('recipeId'),
        posted: moment.utc(moment()).toJSON(),
        text: this.get('commentText'),
        author: {
          username: this.get('currentUser').username,
          name: this.get('currentUser').displayName
        }
      };

      ajax.request({
        url: '/recipes/' + this.get('recipeId') + '/comments',
        method: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(comment)
      }, function(response) {
        store.push('comment', response);
      });

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
