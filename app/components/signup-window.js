import Ember from 'ember';
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

  actions: {
    register: function() {
      console.log(this.get('displayName'), this.get('email'), this.get('password'));
    }
  }
});
