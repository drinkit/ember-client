import Service, { inject as service } from '@ember/service';
import CryptoJS from 'crypto-js';

export default Service.extend({
  ajax: service(),

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
