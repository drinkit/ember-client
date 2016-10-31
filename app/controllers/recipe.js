import Ember from 'ember';

export default Ember.Controller.extend({
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
  tooltipsProvider: Ember.inject.service(),
  repository: Ember.inject.service(),

  actions: {
    changeLike() {
      const self = this;
      const recipeId = parseInt(this.get('recipe').get('id'));
      const curLikes = this.get('recipe.stats.likes') ? this.get('recipe.stats.likes') : 0;
      let userRecipeStats = this.get('currentUser').get('recipeStatsMap')[recipeId];

      if (userRecipeStats) {
        userRecipeStats.liked = !userRecipeStats.liked;
      } else {
        userRecipeStats = {
          'liked': true
        };
        this.get('currentUser').get('recipeStatsMap')[recipeId] = userRecipeStats;
      }

      this.get('ajax').request({
          url: 'users/me/recipeStats/' + recipeId + '/liked?value=' + userRecipeStats.liked,
          contentType: 'application/json;charset=UTF-8',
          method: 'PATCH'
        },
        function(response) {
          self.get('currentUser').notifyPropertyChange('recipeStatsMap');
          self.set('recipe.stats.likes', userRecipeStats.liked ? curLikes + 1 : curLikes - 1);
        });
    }
  },

  recipeIngredients: function() {
    let self = this;
    let repository = this.get('repository');
    let res = self.get('recipe.ingredientsWithQuantities').map(function(item) {
      return {
        name: repository.fetchById('ingredient', item.ingredientId).get('name'),
        quantity: item.quantity,
        unit: item.unit
      }
    });
    return res;
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

  sortedComments: Ember.computed.sort('comments', (a, b) => {
    return moment(a.get('posted')).isBefore(b.get('posted')) ? 1 : -1;
  }),

  isCommentsWorked: Ember.computed('comments', function() {
    return this.get('comments') != null;
  }),

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

  isLiked: Ember.computed('currentUser.recipeStatsMap', 'recipe', function() {
    const userRecipeStats = this.get('currentUser').get('recipeStatsMap');
    const recipeId = parseInt(this.get('recipe').get('id'));
    return userRecipeStats && userRecipeStats[recipeId] && userRecipeStats[recipeId].liked;
  }),

  shareTitle: Ember.computed('recipe', {
    get() {
      return 'Рецепт коктейля "' + this.get('recipe.name') + '"';
    }
  }),

  shareDescription: Ember.computed('recipe', {
    get() {
      let truncatedDesc = this.get('recipe.description');
      let res = this.get('recipe.description').match(/^(?:.*\n){1,3}/);
      if (res.length > 0) {
        truncatedDesc = res[0].replace('\n', ' ').trim() + '..';
      }
      return truncatedDesc;
    }
  })
});
