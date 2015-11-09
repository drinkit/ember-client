import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({  
  authorize: function(sessionData, block) {
  	block('Authorization', sessionData.digests);
  }
});