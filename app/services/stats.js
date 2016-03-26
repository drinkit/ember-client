import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

  incrementViewsCount(recipeId) {
    this.get('ajax').request({
      method: 'PATCH',
      url: '/users/me/stats/' + recipeId
    }, () => {

    }, () => {

    });
  }
});
