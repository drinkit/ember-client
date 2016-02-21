import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  oauthio: Ember.inject.service(),

  hasError: false,

  actions: {
    login() {
      this.set('hasError', false);
      let {
        email,
        password
      } = this.getProperties('email', 'password');
      var self = this;
      this.get("session").authenticate('autheticator:digest', email,
        CryptoJS.SHA256("drinkIt" + password).toString()).then(function() {
          //
        },
        function(reason) {
          self.set('hasError', true);
        });
    },

    socialLogin(socialNetwork) {
      this.get('oauthio').login(socialNetwork);
    },

    signUp() {
      const self = this;
      this.$('#loginWindow').one('hidden.bs.modal', function(e) {
        self.$(document).find('#signUpWindow').modal('show');
      });
      this.$('#loginWindow').modal('hide');
    }
  }

});
