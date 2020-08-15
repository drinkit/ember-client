import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comment-item'],
  currentUser: service(),
  simpleStore: service(),
  ajax: service(),

  actions: {
    deleteComment() {
      const store = this.get('simpleStore');
      const ajax = this.get('ajax');
      const commentId = this.get('comment.id');

      if (confirm("Вы уверены, что хотите удалить свой комментарий?")) {
        ajax.request({
          url: '/recipes/' + this.get('recipeId') + '/comments/' + commentId,
          method: 'DELETE'
        }, function() {
          store.remove('comment', commentId);
        });
      }
    }
  },

  isCurrentUserAuthor: computed('currentUser.username', 'comment', function() {
    return this.get('currentUser.username') === this.get('comment.author.username');
  })
});
