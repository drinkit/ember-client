import Service from '@ember/service';

export default Service.extend({
  showDialog: function(dialogName) {
    this.set('isShow' + dialogName, true);
  },

  hideDialog: function(dialogName) {
    this.set('isShow' + dialogName, false);
  }
});
