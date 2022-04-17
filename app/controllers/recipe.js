import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import moment from "moment";

const OptionsToTags = {
  1: "fire-32.png",
  2: "ice-32.png",
  3: "recommend-32.png",
  4: "iba-32.png",
  5: "layer-32.png"
};

const TypesToTags = {
  1: "long-32.png",
  2: "short-32.png",
  3: "shot-32.png"
};

export default class RecipeController extends Controller {
  @service currentUser;
  @service ajax;
  @service tooltipsProvider;
  @service repository;

  @action
  changeLike() {
    const self = this;
    const recipeId = parseInt(this.recipe.get('id'));
    const curLikes = this.get('recipe.stats.likes') ? this.get('recipe.stats.likes') : 0;
    let userRecipeStats = this.currentUser.get('recipeStatsMap')[recipeId];

    if (userRecipeStats) {
      userRecipeStats.liked = !userRecipeStats.liked;
    } else {
      userRecipeStats = {
        'liked': true
      };
      this.currentUser.get('recipeStatsMap')[recipeId] = userRecipeStats;
    }

    this.ajax.request({
        url: '/users/me/recipeStats/' + recipeId + '/liked?value=' + userRecipeStats.liked,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'PATCH'
      },
      function() {
        self.currentUser.notifyPropertyChange('recipeStatsMap');
        self.set('recipe.stats.likes', userRecipeStats.liked ? curLikes + 1 : curLikes - 1);
      });
  }

  get recipeIngredients() {
    let res = [];
    if (this.get('recipe.ingredientsWithQuantities')) {
      res = this.get('recipe.ingredientsWithQuantities').map(function(item) {
        return {
          id: item.ingredientId,
          name: this.repository.fetchById('ingredient', item.ingredientId).get('name'),
          quantity: item.quantity,
          unit: item.unit
        }
      }, this);
    }
    return res;
  }

  get sortedComments() {
    return this.comments.toArray().sort((a, b) => {
      return moment(a.get('posted')).isBefore(b.get('posted')) ? 1 : -1;
    });
  }

  get isCommentsWorked() {
    return this.comments != null;
  }

  get tags() {
    let self = this;
    let tags = [];
    tags.push({
      img: "/assets/tags/" + TypesToTags[this.recipe.get("cocktailTypeId")],
      tooltip: this.get('tooltipsProvider').getTypeTooltip(this.recipe.get("cocktailTypeId"))
    });
    this.recipe.get("options").forEach(function(item) {
      tags.push({
        img: "/assets/tags/" + OptionsToTags[item],
        tooltip: self.get('tooltipsProvider').getTagTooltip(item)
      });
    });
    return tags;
  }

  get isLiked() {
    const userRecipeStats = this.currentUser.get('recipeStatsMap');
    const recipeId = parseInt(this.recipe.get('id'));
    return userRecipeStats && userRecipeStats[recipeId] && userRecipeStats[recipeId].liked;
  }

  get shareTitle() {
    return `Рецепт коктейля "${this.get('recipe.name')}"`;
  }

  get shareDescription() {
    let truncatedDesc = this.get('recipe.description');
    let res = this.get('recipe.description').match(/^(?:.*\n){1,3}/);
    if (res.length > 0) {
      truncatedDesc = res[0].replace('\n', ' ').trim() + '..';
    }
    return truncatedDesc;
  }
}
