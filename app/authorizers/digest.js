import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  authorize: function(sessionData, block) {
  	block('Authorization', sessionData.digests);
  }
});
