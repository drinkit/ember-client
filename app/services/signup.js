import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),

  register: function(email, password, displayName, successHandler, errorHandler) {
    this.get('ajax').request({
      url: '/users/register',
      method: 'POST',
      data: {
        email: email,
        password: CryptoJS.SHA256("drinkIt" + password).toString(),
        displayName: displayName
      }
    }, successHandler, errorHandler);
  }
});
