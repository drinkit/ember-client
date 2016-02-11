import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['search-by-name'],
  actions: {
    submit: function() {
      this.sendAction("action", this.get("searchString"));
    }
  }
});
