import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({  
  authorize: function(sessionData, block) {
    console.log(sessionData);
  	block('Authorization', sessionData.digests);
  }
});