import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class CommentItem extends Component {
  @service currentUser;
  @service simpleStore;
  @service ajax;

  @action
  deleteComment() {
    const store = this.simpleStore;
    const ajax = this.ajax;
    const commentId = this.args.comment.id;

    if (confirm("Вы уверены, что хотите удалить свой комментарий?")) {
      ajax.request({
        url: '/recipes/' + this.args.recipeId + '/comments/' + commentId,
        method: 'DELETE'
      }, function() {
        store.remove('comment', commentId);
      });
    }
  }

  get isCurrentUserAuthor() {
    return this.currentUser.username === this.args.comment.author.username;
  }
}
