import { htmlSafe } from '@ember/template';
import { schedule } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

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
  sortedIngredients = A();

  constructor(owner, args) {
    super(owner, args);
    this.reorderElements();
  }

  get sortedAndHighlightedIngredients() {
    this.sortedIngredients.forEach(i => {
      i.isInBar = this.currentUser.isAuthenticated ? this.currentUser.barItems.some(barItem => barItem.ingredientId === i.id) : false;
      i.tooltip = i.isInBar ? "есть в вашем баре" : "";
    }, this);

    return this.sortedIngredients;
  }

  getTextWidth(text, font) {
    const canvas = document.getElementById("canvas") || document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  reorderElements() {
    const that = this;
    schedule('afterRender', this, function() {
      const sortedIngredients = [];
      const selectedIngredients = that.args.selectedIngredients;
      const store = that.simpleStore;
      const recipe = this.args.recipe;
      const cocktailIngredients = recipe.get("ingredientsWithQuantities");
      cocktailIngredients.forEach(function(item) {
        const ingr = store.find("ingredient", item.ingredientId);
        const type = selectedIngredients && selectedIngredients.includes(parseInt(ingr.get("id"))) ? "selected-ingredient" : "unselected-ingredient";
        const isInBar = that.currentUser.barItems.some(barItem => barItem.ingredientId === item.ingredientId);
        sortedIngredients.push(new Ingredient(
          item.ingredientId,
          ingr.get("name"),
          type,
          isInBar,
          isInBar ? "есть в вашем баре" : ""
        ));
      });
      //
      const gapBetweenIngredients = 5;
      //
      const curElem = document.querySelector(".recipe-item");
      const recipeBoxHeight = curElem.clientHeight;
      const tagsHeight = curElem.querySelector("#tags").clientHeight;
      const recipeNameHeight = curElem.querySelector("#recipeName").offsetHeight;
      const paddingTop = 4 + recipeNameHeight;
      const paddingBottom = 4 + tagsHeight;

      const availableHeight = recipeBoxHeight - paddingBottom - paddingTop + gapBetweenIngredients;
      ////
      const recipeBoxWidth = curElem.clientWidth;
      const imageWidth = 5 + 134 + 5;
      const paddingRight = 5;
      const availableWidth = recipeBoxWidth - imageWidth - paddingRight + gapBetweenIngredients;
      ////
      let ingredientsWithWidths = [];

      sortedIngredients.forEach(function(item) {
        ingredientsWithWidths.push({
          item: item,
          width: that.getTextWidth(item.name, "12px Century Gothic") + 10
        });
      });
      ingredientsWithWidths = ingredientsWithWidths.sortBy("width");
      //
      const newOrder = [];
      let curRowWidth = 0;
      let totalHeight = 0;
      const rendererHeight = 25 + gapBetweenIngredients;
      while (totalHeight + rendererHeight <= availableHeight && ingredientsWithWidths.length !== 0) {
        curRowWidth = 0;
        let rowIsNotFilled = true;
        const curIngredient = ingredientsWithWidths.shift();
        newOrder.push(curIngredient.item);
        curRowWidth += curIngredient.width + gapBetweenIngredients;
        while (rowIsNotFilled) {
          let maxItem = -1;
          let maxSize = 0;
          for (let i = 0; i < ingredientsWithWidths.length; i++) {
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
        const dotsWidth = 30;
        const dots = {
          name: "...",
          className: "unselected-ingredient",
          tooltip: ""
        };

        if (curRowWidth + dotsWidth > availableWidth) {
          ingredientsWithWidths.push({item: newOrder.pop()});
        }

        newOrder.push(dots);

        for (let l = 0; l < ingredientsWithWidths.length; l++) {
          const item = ingredientsWithWidths[l];
          dots.tooltip += item.item.name + "\n";
        }

        dots.tooltip = dots.tooltip.slice(0, dots.tooltip.length - 1);
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
    const userRecipeStats = this.currentUser.recipeStatsMap;
    const recipeId = parseInt(this.args.recipe.get('id'));
    return userRecipeStats && userRecipeStats[recipeId] && userRecipeStats[recipeId].liked;
  }

  get maxIngredientWidthStyle() {
    return htmlSafe('max-width:' + this.maxIngredientWidth + 'px;');
  }
}

class Ingredient {
  id;
  name;
  className;
  @tracked isInBar;
  @tracked tooltip;

  constructor(id, name, className, isInBar, tooltip) {
    this.id = id;
    this.name = name;
    this.className = className;
    this.isInBar = isInBar;
    this.tooltip = tooltip;
  }
}
