import Ember from 'ember';
import OAuthIO from 'npm:oauthio-web';
import CryptoJS from 'npm:crypto-js';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  signup: Ember.inject.service(),

  initialize: function() {
    OAuthIO.OAuth.initialize('w5lnaZLTxqd0EeBl99PrcUK3UBo');
  },

  login: function(socialNetwork) {
    var self = this;
    OAuthIO.OAuth.popup(socialNetwork).done(function(result) {
      result.me(['name', 'email', 'id']).done(function(data) {
        var login = socialNetwork + data.id;
        var password = socialNetwork + data.id;
        self.get("session").authenticate('autheticator:digest', login,
  				CryptoJS.SHA256("drinkIt" + password).toString()).then(function() {
            // yeaah!
          },
          function(error) {
            if (error === "Incorrect credentials") {
              self.get('signup').register(login, password, data.name, function(response) {
                self.get("session").authenticate('autheticator:digest', login,
          				CryptoJS.SHA256("drinkIt" + password).toString());
              });
            }
          });
      }).fail(function(error) {
        console.log(error);
      });
    }).fail(function(error) {
      console.log(error);
    });
  }
});
