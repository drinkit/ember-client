import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['comment-item'],
  currentUser: Ember.inject.service(),
  simpleStore: Ember.inject.service(),
  ajax: Ember.inject.service(),

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

  isCurrentUserAuthor: Ember.computed('currentUser.username', 'comment', function() {
    return this.get('currentUser.username') === this.get('comment.author.username');
  })
});
