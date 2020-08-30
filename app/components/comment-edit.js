import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import moment from 'moment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CommentEdit extends Component {
  @service currentUser;
  @service ajax;
  @service modalManager;
  @service simpleStore;

  comment = null;

  @tracked
  commentText = "";

  @action
  submitComment() {
    const store = this.simpleStore;
    const ajax = this.ajax;

    let comment = {
      recipeId: this.args.recipeId,
      posted: moment.utc(moment()).toJSON(),
      text: this.commentText,
      author: {
        username: this.currentUser.username,
        name: this.currentUser.displayName
      }
    };

    ajax.request({
      url: '/recipes/' + this.args.recipeId + '/comments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(comment)
    }, function(response) {
      store.push('comment', response);
    });

    this.commentText = "";
  }

  @action
  showLogin() {
    this.modalManager.showDialog('Login');
  }

  @action
  showSignUp() {
    this.modalManager.showDialog('SignUp');
  }
}
