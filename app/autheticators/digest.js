import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  restore(data) {
    //
  },
  authenticate(email, password) {
    console.log(email, password);
  },
  invalidate(data) {
  	//
  }
});