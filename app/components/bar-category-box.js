import Component from '@ember/component';

export default Component.extend({
  classNames: ['flex-1 rounded-5px shadow-recipe m-5px'],
  title: '',
  category: '',

  actions: {
    removeItem: function(item) {
      this.get('onRemoveItem')(item);
    }
  }
});
