import { inject as service } from '@ember/service';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),
  ajax: service(),
  modalManager: service(),
  simpleStore: service(),
  comment: null,
  classNames: ['font-gothic text-sm text-right mb-20px'],

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
