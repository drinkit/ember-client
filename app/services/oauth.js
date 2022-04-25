import Service, { inject as service } from '@ember/service';
import Hello from 'hellojs';
import CryptoJS from 'crypto-js';

export default class OauthService extends Service {
  @service digestSession;
  @service signup;

  initialize() {
    Hello.init({
      google: '24577751850.apps.googleusercontent.com',
      vk: '4425288',
      facebook: '1528690400686454'
    }, {redirect_uri: '/'});
  }

  login(socialNetwork) {
    const self = this;
    let onAuth = function(auth) {
      Hello(socialNetwork).api('me').then(function(result) {
        Hello.off('auth.login', onAuth);
        const login = socialNetwork + result.id;
        const password = socialNetwork + result.id;

        self.digestSession.authenticate('autheticator:digest', login,
          CryptoJS.SHA256("drinkIt" + password).toString()).then(function() {
            // yeaah!
          },
          function(error) {
            if (error === "Incorrect credentials") {
              self.signup.register(login, password, result.name, function(response) {
                self.digestSession.authenticate('autheticator:digest', login,
                  CryptoJS.SHA256("drinkIt" + password).toString());
              });
            }
          });
      });
    };
    Hello.on('auth.login', onAuth);
    Hello(socialNetwork).login();
  }

  logout() {
    Hello('vk').logout();
    Hello('google').logout();
    Hello('facebook').logout();
    //
    this.digestSession.data.digests = {};
    this.digestSession.store.clear();
    this.digestSession.invalidate();
  }
}
