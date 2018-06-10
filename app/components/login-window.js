import Ember from 'ember';
import CryptoJS from 'crypto-js';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  oauth: Ember.inject.service(),

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
          self.get('hideDialog')('Login');
        },
        function(reason) {
          self.set('hasError', true);
          self.set('isLogining', false);
        });
    },

    socialLogin(socialNetwork) {
      this.get('oauth').login(socialNetwork);
      this.get('hideDialog')('Login');
    },

    signUp() {
      this.get('hideDialog')('Login');
      this.get('showDialog')('SignUp');
    },

    close() {
      this.get('hideDialog')('Login');
    }
  }

});
