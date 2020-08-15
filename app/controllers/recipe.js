import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  currentUser: service(),
  ajax: service(),
  tooltipsProvider: service(),
  repository: service(),

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
          url: '/users/me/recipeStats/' + recipeId + '/liked?value=' + userRecipeStats.liked,
          contentType: 'application/json;charset=UTF-8',
          method: 'PATCH'
        },
        function(response) {
          self.get('currentUser').notifyPropertyChange('recipeStatsMap');
          self.set('recipe.stats.likes', userRecipeStats.liked ? curLikes + 1 : curLikes - 1);
        });
    }
  },

  recipeIngredients: computed('recipe.ingredientsWithQuantities', function() {
    let self = this;
    let repository = this.get('repository');
    let res = [];
    if (self.get('recipe.ingredientsWithQuantities')) {
      res = self.get('recipe.ingredientsWithQuantities').map(function(item) {
        return {
          id: item.ingredientId,
          name: repository.fetchById('ingredient', item.ingredientId).get('name'),
          quantity: item.quantity,
          unit: item.unit
        }
      });
    }
    return res;
  }),

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

  sortedComments: sort('comments', (a, b) => {
    return moment(a.get('posted')).isBefore(b.get('posted')) ? 1 : -1;
  }),

  isCommentsWorked: computed('comments', function() {
    return this.get('comments') != null;
  }),

  tags: computed('recipe', {
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

  isLiked: computed('currentUser.recipeStatsMap', 'recipe', function() {
    const userRecipeStats = this.get('currentUser').get('recipeStatsMap');
    const recipeId = parseInt(this.get('recipe').get('id'));
    return userRecipeStats && userRecipeStats[recipeId] && userRecipeStats[recipeId].liked;
  }),

  shareTitle: computed('recipe', {
    get() {
      return 'Рецепт коктейля "' + this.get('recipe.name') + '"';
    }
  }),

  shareDescription: computed('recipe', {
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
