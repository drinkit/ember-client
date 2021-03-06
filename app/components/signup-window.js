import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';
import {
  validator,
  buildValidations
}
from 'ember-cp-validations';

var Validations = buildValidations({
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

export default Ember.Component.extend(Validations, {
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),
  signup: Ember.inject.service(),

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
          self.sendAction('hideDialog', 'SignUp');
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
      this.sendAction('hideDialog', 'SignUp');
      this.sendAction('showDialog', 'Login');
    },

    close() {
      this.sendAction('hideDialog', 'SignUp');
    }
  }
});
