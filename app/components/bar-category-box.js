import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['bar-category-box'],
  title: '',
  category: '',

  categoryIngredients: Ember.computed('ingredients', 'category', function() {
    var self = this;
    return this.get('ingredients').filter(function(item) {
      return item.category == self.category;
    })
  })
});
