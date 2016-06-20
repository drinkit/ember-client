import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  oauthio: Ember.inject.service(),

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
          self.sendAction('hideDialog', 'Login');
        },
        function(reason) {
          self.set('hasError', true);
          self.set('isLogining', false);
        });
    },

    socialLogin(socialNetwork) {
      this.get('oauthio').login(socialNetwork);
      this.sendAction('hideDialog', 'Login');
    },

    signUp() {
      this.sendAction('hideDialog', 'Login');
      this.sendAction('showDialog', 'SignUp');
    },

    close() {
      this.sendAction('hideDialog', 'Login');
    }
  }

});
