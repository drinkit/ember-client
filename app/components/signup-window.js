import { inject as service } from '@ember/service';
import Component from '@ember/component';
import CryptoJS from 'crypto-js';
import {
  validator,
  buildValidations
}
from 'ember-cp-validations';

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

export default Component.extend(Validations, {
  ajax: service(),
  session: service(),
  signup: service(),

  hasError: false,

  actions: {
    register: function() {
      var self = this;
      this.set("hasError", false);
      let {
        displayName,
        email,
        password
      } = this.getProperties('displayName', 'email', 'password');
      this.get('signup').register(email, password, displayName,
        function(response) {
          self.hideDialog('SignUp');
          self.get("session").authenticate('autheticator:digest', email,
            CryptoJS.SHA256("drinkIt" + password).toString());
        },
        function(xhr, status, error) {
          if (xhr.status === 403) {
            self.set("hasError", true);
          } else {
            console.log(xhr, status, error);
          }
        });
    },

    login() {
      this.hideDialog('SignUp');
      this.showDialog('Login');
    },

    close() {
      this.hideDialog('SignUp');
    }
  }
});
