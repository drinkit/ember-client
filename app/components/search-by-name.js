import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    search: function(value) {
      this.sendAction('search', value);
      $('input[type="search"]').blur();
    }
  }
});
