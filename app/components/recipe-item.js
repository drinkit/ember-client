import Ember from 'ember';

export default Ember.Component.extend({
  currentUser: Ember.inject.service(),
  tooltipsProvider: Ember.inject.service(),
  simpleStore: Ember.inject.service(),
  classNames: ['col-md-6'],
  typesToTags: {
    1: "long-32.png",
    2: "short-32.png",
    3: "shot-32.png"
  },
  optionsToTags: {
    1: "fire-32.png",
    2: "ice-32.png",
    3: "recommend-32.png",
    4: "iba-32.png",
    5: "layer-32.png"
  },
  maxIngredientWidth: 999999,
  sortedIngredients: [],
  getTextWidth: function(text, font) {
    var canvas = document.getElementById("canvas") || document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  },

  didInsertElement: function() {
    var that = this;
    Ember.run.schedule('afterRender', this, function() {
      var sortedIngredients = [];
      var selectedIngredients = that.get("selectedIngredients");
      var store = that.get("simpleStore");
      var recipe = that.get("recipe");
      var cocktailIngredients = recipe.get("ingredientsWithQuantities");
      cocktailIngredients.forEach(function(item) {
        var ingr = store.find("ingredient", item.ingredientId);
        var type = that.getIngredientStyle(parseInt(ingr.get("id")));
        sortedIngredients.push({
          name: ingr.get("name"),
          className: type
        });
      });
      //
      var gapBetweenIngredients = 5;
      //
      var recipeBoxHeight = that.$().find(".recipe-box").height();
      var tagsHeight = that.$().find("#tags").height();
      var recipeNameHeight = that.$().find(".recipe-name-text").height();
      var paddingTop = 4 + recipeNameHeight;
      var paddingBottom = 4 + tagsHeight;

      var availableHeight = recipeBoxHeight - paddingBottom - paddingTop + gapBetweenIngredients;
      ////
      var recipeBoxWidth = that.$().find(".recipe-box").width();
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

      that.set("maxIngredientWidth", availableWidth - 4);
      that.set("sortedIngredients", newOrder);
    });
  },

  tags: Ember.computed({
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

  getIngredientStyle(ingredientId) {
    var selectedIngredients = this.get('selectedIngredients');
    var barItemsIds = this.get('barItemsIds');
    var style = '';
    if (selectedIngredients && selectedIngredients.includes(ingredientId)) {
      style = 'selected-ingredient';
    } else {
      style = 'unselected-ingredient';
    }

    if (barItemsIds && barItemsIds.includes(ingredientId)) {
      style += ' bar-ingredient';
    }

    return style;
  },

  isLiked: Ember.computed('currentUser.recipeStatsMap', function() {
    const userRecipeStats = this.get('currentUser').get('recipeStatsMap');
    const recipeId = parseInt(this.get('recipe').get('id'));
    return userRecipeStats && userRecipeStats[recipeId] && userRecipeStats[recipeId].liked;
  }),

  barItemsIds: Ember.computed('currentUser.barItems', function() {
    let barItemsIds = this.get('currentUser.barItems').filter(function(item) {
      return item.active;
    }).map(function(item) {
      return item.ingredientId;
    });
    return barItemsIds;
  }),

  maxIngredientWidthStyle: Ember.computed('maxIngredientWidth',
    function() {
      return Ember.String.htmlSafe('max-width:' + this.get('maxIngredientWidth') + 'px;');
    })
});
