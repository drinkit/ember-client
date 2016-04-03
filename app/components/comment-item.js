import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['comment-item'],

  actions: {
    deleteComment() {
      if (confirm("Вы уверены, что хотите удалить свой комментарий?")) {
        this.get('comment').deleteRecord();
        this.get('comment').save();
      }
    }
  }
});
