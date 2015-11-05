import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({  
  header: function() {
    return "test-digest";
  },

  authorize: function(sessionData, block) {
    console.log(sessionData);
  	block('Authorization', this.get('header')());
  }
});