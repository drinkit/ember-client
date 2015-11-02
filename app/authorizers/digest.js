import Base from 'simple-auth/authorizers/base';  
import Ember from 'ember';

export default Base.extend({  
  header: function() {
    return "test-digest";
  },

  authorize: function(sessionData, jqXHR) {
  	jqXHR.setRequestHeader('Authorization', this.get('header'));
  }
});