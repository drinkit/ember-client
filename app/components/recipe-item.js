import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import { schedule } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RecipeItem extends Component {
  @service currentUser;
  @service tooltipsProvider;
  @service simpleStore;

  typesToTags = {
    1: "long-32.png",
    2: "short-32.png",
    3: "shot-32.png"
  };
  optionsToTags = {
    1: "fire-32.png",
    2: "ice-32.png",
    3: "recommend-32.png",
    4: "iba-32.png",
    5: "layer-32.png"
  };

  @tracked
  maxIngredientWidth = 999999;

  @tracked
  sortedIngredients = [];

  constructor(owner, args) {
    super(owner, args);
    this.reorderElements();
  }

  getTextWidth(text, font) {
    var canvas = document.getElementById("canvas") || document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }

  reorderElements() {
    var that = this;
    schedule('afterRender', this, function() {
      var sortedIngredients = [];
      var selectedIngredients = that.args.selectedIngredients;
      var store = that.simpleStore;
      var recipe = this.args.recipe;
      var cocktailIngredients = recipe.get("ingredientsWithQuantities");
      cocktailIngredients.forEach(function(item) {
        var ingr = store.find("ingredient", item.ingredientId);
        var type = selectedIngredients && selectedIngredients.includes(parseInt(ingr.get("id"))) ? "selected-ingredient" : "unselected-ingredient";
        sortedIngredients.push({
          name: ingr.get("name"),
          className: type
        });
      });
      //
      var gapBetweenIngredients = 5;
      //
      const curElem = document.querySelector(".recipe-item");
      var recipeBoxHeight = curElem.clientHeight;
      var tagsHeight = curElem.querySelector("#tags").clientHeight;
      var recipeNameHeight = curElem.querySelector("#recipeName").offsetHeight;
      var paddingTop = 4 + recipeNameHeight;
      var paddingBottom = 4 + tagsHeight;

      var availableHeight = recipeBoxHeight - paddingBottom - paddingTop + gapBetweenIngredients;
      ////
      var recipeBoxWidth = curElem.clientWidth;
      var imageWidth = 5 + 134 + 5;
      var paddingRight = 5;
      var availableWidth = recipeBoxWidth - imageWidth - paddingRight + gapBetweenIngredients;
      ////
      var ingredients = sortedIngredients;
      var ingredientsWithWidths = [];

      ingredients.forEach(function(item) {
        ingredientsWithWidths.push({
          item: item,
          width: that.getTextWidth(item.name, "12px Century Gothic") + 10
        });
      });
      ingredientsWithWidths = ingredientsWithWidths.sortBy("width");
      //
      var newOrder = [];
      var curRowWidth = 0;
      var totalHeight = 0;
      var rendererHeight = 25 + gapBetweenIngredients;
      while (totalHeight + rendererHeight <= availableHeight && ingredientsWithWidths.length !== 0) {
        curRowWidth = 0;
        var rowIsNotFilled = true;
        var curIngredient = ingredientsWithWidths.shift();
        newOrder.push(curIngredient.item);
        curRowWidth += curIngredient.width + gapBetweenIngredients;
        while (rowIsNotFilled) {
          var maxItem = -1;
          var maxSize = 0;
          for (var i = 0; i < ingredientsWithWidths.length; i++) {
            if (curRowWidth + ingredientsWithWidths[i].width < availableWidth) {
              if (curRowWidth + ingredientsWithWidths[i].width > maxSize) {
                maxSize = curRowWidth + ingredientsWithWidths[i].width;
                maxItem = i;
              }
            }
          }

          if (maxItem !== -1) {
            newOrder.push(ingredientsWithWidths[maxItem].item);
            curRowWidth += ingredientsWithWidths[maxItem].width + gapBetweenIngredients;
            ingredientsWithWidths.splice(maxItem, 1);
          } else {
            rowIsNotFilled = false;
          }
        }

        totalHeight += rendererHeight;
      }

      if (ingredientsWithWidths.length > 0) {
        var dotsWidth = 30;
        var dots = {
          name: "...",
          className: "unselected-ingredient",
          tooltip: ""
        };

        var deletedElement;

        if (curRowWidth + dotsWidth <= availableWidth) {
          newOrder.push(dots);
        } else {
          deletedElement = ingredientsWithWidths.pop();
          newOrder.push(dots);
        }

        for (var l = 0; l < ingredientsWithWidths.length; l++) {
          var item = ingredientsWithWidths[l];
          dots.tooltip += item.item.name + "\n";
        }

        if (deletedElement) {
          dots.tooltip += deletedElement.item.name;
        } else {
          dots.tooltip = dots.tooltip.slice(0, dots.tooltip.length - 1);
        }
      }

      that.maxIngredientWidth = availableWidth - 4;
      that.sortedIngredients = newOrder;
    });
  }

  get tags() {
    let self = this;
    let tags = [];
    let recipe = this.args.recipe;
    const typesToTags = this.typesToTags;
    const optionsToTags = this.optionsToTags;
    tags.push({
      img: "/assets/tags/" + typesToTags[recipe.get("cocktailTypeId")],
      tooltip: self.tooltipsProvider.getTypeTooltip(recipe.get("cocktailTypeId"))
    });
    recipe.get("options").forEach(function(item) {
      tags.push({
        img: "/assets/tags/" + optionsToTags[item],
        tooltip: self.tooltipsProvider.getTagTooltip(item)
      });
    });
    return tags;
  }

  get isLiked() {
    const userRecipeStats = this.currentUser.get('recipeStatsMap');
    const recipeId = parseInt(this.args.recipe.get('id'));
    return userRecipeStats && userRecipeStats[recipeId] && userRecipeStats[recipeId].liked;
  }

  get maxIngredientWidthStyle() {
    return htmlSafe('max-width:' + this.maxIngredientWidth + 'px;');
  }
}
