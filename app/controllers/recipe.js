import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
  tooltipsProvider: Ember.inject.service(),

  actions: {
    changeLike() {
      const recipeId = parseInt(this.get('recipe').get('id'));
      const userLikes = this.get('currentUser').get('likes');
      const likedRecipeIndex = userLikes.indexOf(recipeId);

      if (likedRecipeIndex == -1) {
        userLikes.pushObject(recipeId);
      } else {
        userLikes.removeObject(recipeId);
      }

      this.get('currentUser').set('likes', userLikes);

      this.get('ajax').request({
        url: 'users/me',
        contentType: 'application/json;charset=UTF-8',
        method: 'PATCH',
        data: JSON.stringify({
          likes: userLikes
        })
      }, function(response) {

      });
    }
  },

  ingredients: function() {
    var self = this;
    return DS.PromiseObject.create({
      promise: this.store.findAll('ingredient').then(function() {
        return self.get('recipe').get('ingredientsWithQuantities').map(function(item) {
          return {
            name: self.store.peekRecord('ingredient', item.ingredientId).get('name'),
            quantity: item.quantity
          };
        });
      })
    });
  }.property('recipe.ingredientsWithQuantities'),

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

  tags: Ember.computed('recipe', {
    get() {
      let self = this;
      let tags = [];
      let recipe = this.get("recipe");
      const typesToTags = this.get("typesToTags");
      const optionsToTags = this.get("optionsToTags");
      tags.push({
        img: "/assets/tags/" + typesToTags[recipe.get("cocktailTypeId")],
        tooltip: self.get('tooltipsProvider').getTypeTooltip(recipe.get("cocktailTypeId"))
      });
      recipe.get("options").forEach(function(item) {
        tags.push({
          img: "/assets/tags/" + optionsToTags[item],
          tooltip: self.get('tooltipsProvider').getTagTooltip(item)
        });
      });
      return tags;
    }
  }),

  isLiked: Ember.computed('currentUser.likes.[]', 'recipe', function() {
    const userLikes = this.get('currentUser').get('likes');
    return userLikes && userLikes.indexOf(parseInt(this.get('recipe').get('id'))) >= 0;
  })
});
