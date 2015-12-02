import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';
import {
  validator, buildValidations
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

  actions: {
    register: function() {
      var self = this;
      let {
        displayName, email, password
      } = this.getProperties('displayName', 'email', 'password');
      this.get('ajax').request({
        url: '/users/register',
        method: 'POST',
        data: {
          email: email,
          password: CryptoJS.SHA256("drinkIt" + password).toString(),
          displayName: displayName
        }
      }, function(response) {
        console.log(response);
        Ember.$('#signUpWindow').modal('hide');
        self.get("session").authenticate('autheticator:digest', email,
          CryptoJS.SHA256("drinkIt" + password).toString());
      }, function(xhr, status, error) {
        console.log(status, error);
      });
    }
  }
});
