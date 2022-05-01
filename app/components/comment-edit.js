import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import utc from 'dayjs/plugin/utc';

export default class CommentEdit extends Component {
  @service currentUser;
  @service ajax;
  @service modalManager;
  @service simpleStore;
  @service dayjs;

  comment = null;

  @tracked
  commentText = "";

  @action
  submitComment() {
    const store = this.simpleStore;
    this.dayjs.self.extend(utc);

    let comment = {
      recipeId: this.args.recipeId,
      posted: this.dayjs.self().utc().toJSON(),
      text: this.commentText,
      author: {
        username: this.currentUser.username,
        name: this.currentUser.displayName
      }
    };

    this.ajax.request({
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
