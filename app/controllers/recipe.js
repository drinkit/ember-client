import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
  ingredients: function() {
    var self = this;
    return DS.PromiseObject.create({
      promise: this.store.findAll('ingredient').then(function() {
        return self.get('model').get('ingredientsWithQuantities').map(function(item) {
          return {
            name: self.store.peekRecord('ingredient', item.ingredientId).get('name'),
            quantity: item.quantity
          };
        });
      })
    });
  }.property('model.ingredientsWithQuantities'),

  optionsToTags: {
    1: "fire-32.png",
    2: "ice-32.png",
    3: "recommend-32.png",
    4: "iba-32.png",
    5: "layer-32.png"
  },

  typesToTags: {
    1: "long-32.png",
    2: "short-32.png",
    3: "shot-32.png"
  },

  tags: Ember.computed({
    get() {
      var tags = [];
      var recipe = this.get("model");
      var typesToTags = this.get("typesToTags");
      var optionsToTags = this.get("optionsToTags");
      tags.push("/assets/tags/" + typesToTags[recipe.get("cocktailTypeId")]);
      recipe.get("options").forEach(function(item) {
        tags.push("/assets/tags/" + optionsToTags[item]);
      });
      return tags;
    }
  })
});
