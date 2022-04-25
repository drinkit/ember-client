import Service, { inject as service } from '@ember/service';
import CryptoJS from 'crypto-js';

export default class SignupService extends Service {
  @service ajax;

  register(email, password, displayName, successHandler, errorHandler) {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', CryptoJS.SHA256("drinkIt" + password).toString());
    formData.append('displayName', displayName);
    this.ajax.request({
      url: '/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: formData
    }, successHandler, errorHandler);
  }
}
