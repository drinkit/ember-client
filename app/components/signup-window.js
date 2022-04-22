import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Object from "@ember/object";
import CryptoJS from 'crypto-js';
import {
  validator,
  buildValidations
}
from 'ember-cp-validations';
import { getOwner } from '@ember/application';

const Validations = buildValidations({
  displayName: validator('presence', {
    presence: true,
    message: 'Это поле не должно быть пустым'
  }),
  email: [
    validator('presence', {
      presence: true,
      message: 'Это поле не должно быть пустым'
    }),
    validator('format', {
      type: 'email',
      message: 'Электронная почта имеет некорректный формат'
    })
  ],
  password: validator('presence', {
    presence: true,
    message: 'Это поле не должно быть пустым'
  }),
  passwordConfirmation: [
    validator('presence', {
      presence: true,
      message: 'Это поле не должно быть пустым'
    }),
    validator('confirmation', {
      on: 'password',
      message: 'Пароли не совпадают'
    })
  ]
});

class Form extends Object.extend(Validations) {
  @tracked displayName = "";
  @tracked email = "";
  @tracked password = "";
  @tracked passwordConfirmation = "";
}

export default class SignupWindow extends Component {
  @service ajax;
  @service digestSession;
  @service signup;

  @tracked hasError = false;

  constructor(owner, args) {
    super(owner, args);
    this.validationModel = Form.create(getOwner(this).ownerInjection());
  }

  @action
  register() {
    const self = this;
    this.hasError = false;
    let {
      displayName,
      email,
      password
    } = this.validationModel.getProperties('displayName', 'email', 'password');
    this.signup.register(email, password, displayName,
      function(response) {
        self.args.hideDialog('SignUp');
        self.session.authenticate('autheticator:digest', email,
          CryptoJS.SHA256("drinkIt" + password).toString());
      },
      function(xhr, status, error) {
        if (xhr.status === 403) {
          self.hasError = true;
        } else {
          console.log(xhr, status, error);
        }
      });
  }

  @action
  login() {
    this.args.hideDialog('SignUp');
    this.args.showDialog('Login');
  }

  @action
  close() {
    this.args.hideDialog('SignUp');
  }
}
