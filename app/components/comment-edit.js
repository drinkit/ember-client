import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  currentUser: Ember.inject.service(),
  store: Ember.inject.service(),
  comment: null,
  classNames: ['comment-edit'],

  actions: {
    submitComment() {
      let comment = this.get('store').createRecord('comment', {
        recipeId: this.get('recipeId'),
        posted: moment(),
        text: this.get('commentText'),
        author: {
          userId: this.get('currentUser').id,
          name: this.get('currentUser').displayName
        }
      });
      comment.save();
      this.set('commentText', '');
    }
  }

});
