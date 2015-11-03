import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({
  restore(data) {
    //
  },
  authenticate(email, password) {
    console.log(email, password);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      // resolve = log them in and set object in session
      // reject = didn't authenticate so don't log them in
      Ember.run(function() {
          resolve({email: email, password: password});
        });
    });
  },
  invalidate(data) {
  	//
  }
});