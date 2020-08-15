import Service, { inject as service } from '@ember/service';
import Hello from 'hellojs';
import CryptoJS from 'crypto-js';

export default Service.extend({
  session: service(),
  signup: service(),

  initialize: function() {
    Hello.init({
      google: '24577751850.apps.googleusercontent.com',
      vk: '4425288',
      facebook: '1528690400686454'
    }, {redirect_uri: '/'});
  },

  login: function(socialNetwork) {
    const self = this;
    let onAuth = function(auth) {
      Hello(socialNetwork).api('me').then(function(result) {
        Hello.off('auth.login', onAuth);
        var login = socialNetwork + result.id;
        var password = socialNetwork + result.id;

        self.get("session").authenticate('autheticator:digest', login,
          CryptoJS.SHA256("drinkIt" + password).toString()).then(function() {
            // yeaah!
          },
          function(error) {
            if (error === "Incorrect credentials") {
              self.get('signup').register(login, password, result.name, function(response) {
                self.get("session").authenticate('autheticator:digest', login,
                  CryptoJS.SHA256("drinkIt" + password).toString());
              });
            }
          });
      });
    };
    Hello.on('auth.login', onAuth);
    Hello(socialNetwork).login();
  },

  logout: function() {
    Hello('vk').logout();
    Hello('google').logout();
    Hello('facebook').logout();
    //
    this.get('session.data').digests = {};
    this.get('session.store').clear();
    this.get('session').invalidate();
  }
});
