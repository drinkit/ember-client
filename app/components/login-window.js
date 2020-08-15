import { inject as service } from '@ember/service';
import Component from '@ember/component';
import CryptoJS from 'crypto-js';

export default Component.extend({
  session: service(),
  ajax: service(),
  oauth: service(),

  hasError: false,
  isLogining: false,

  actions: {
    login() {
      this.set('isLogining', true);
      this.set('hasError', false);
      let {
        email,
        password
      } = this.getProperties('email', 'password');
      var self = this;
      this.get("session").authenticate('autheticator:digest', email,
        CryptoJS.SHA256("drinkIt" + password).toString()).then(function() {
          self.set('isLogining', false);
          self.hideDialog('Login');
        },
        function() {
          self.set('hasError', true);
          self.set('isLogining', false);
        });
    },

    socialLogin(socialNetwork) {
      this.get('oauth').login(socialNetwork);
      this.hideDialog('Login');
    },

    signUp() {
      this.hideDialog('Login');
      this.showDialog('SignUp');
    },

    close() {
      this.hideDialog('Login');
    }
  }

});
