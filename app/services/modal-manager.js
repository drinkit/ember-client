import Ember from 'ember';

export default Ember.Service.extend({
  showDialog: function(dialogName) {
    this.set('isShow' + dialogName, true);
  },

  hideDialog: function(dialogName) {
    this.set('isShow' + dialogName, false);
  }
});
