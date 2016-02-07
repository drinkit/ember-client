import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['bar-category-box'],
  title: '',
  category: '',

  actions: {
    removeItem: function(item) {
      this.get('onRemoveItem')(item);
    }
  }
});
