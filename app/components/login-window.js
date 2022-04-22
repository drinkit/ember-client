import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import CryptoJS from 'crypto-js';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LoginWindow extends Component{
  @service digestSession;
  @service ajax;
  @service oauth;

  @tracked hasError = false;
  @tracked isLogining = false;
  @tracked email;
  @tracked password;

  @action
  login() {
    this.isLogining = true;
    this.hasError = false;
    const self = this;
    this.digestSession.authenticate('autheticator:digest', this.email,
      CryptoJS.SHA256("drinkIt" + this.password).toString()).then(function() {
        self.isLogining = false;
        self.args.hideDialog('Login');
      },
      function() {
        self.hasError = true;
        self.isLogining = false;
      });
  }

  @action
  socialLogin(socialNetwork) {
    this.oauth.login(socialNetwork);
    this.args.hideDialog('Login');
  }

  @action
  signUp() {
    this.args.hideDialog('Login');
    this.args.showDialog('SignUp');
  }

  @action
  close() {
    this.args.hideDialog('Login');
  }
}
