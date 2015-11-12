import Ember from 'ember';

export default Ember.Component.extend({

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
	sortedIngredients: [],
	getTextWidth: function(text, font) {
	    var canvas = document.getElementById("canvas") || document.createElement("canvas");
	    var context = canvas.getContext("2d");
	    context.font = font;
	    var metrics = context.measureText(text);
	    return metrics.width;
	},
	didInsertElement: function() {
		var sortedIngredients = [];
		var selectedIngredients = this.get("selectedIngredients");
		var store = this.get("store");
		var recipe = this.get("recipe");
		var cocktailIngredients = recipe.get("ingredientsWithQuantities");
		cocktailIngredients.forEach(function(item) {
			var ingr = store.peekRecord("ingredient", item.ingredientId);
			var type = selectedIngredients.contains(ingr.get("id").toString()) ? "selected-ingredient" : "unselected-ingredient";
			sortedIngredients.push({
				name: ingr.get("name"),
				className: type
			});
		});
		//
		var gapBetweenIngredients = 5;
		//
		var that = this;
		var recipeBoxHeight = this.$().find(".recipe-box").height();
		var tagsHeight = this.$().find("#tags").height();
		var recipeNameHeight = this.$().find(".recipe-name-text").height();
		var paddingTop = 4 + recipeNameHeight;
		var paddingBottom = 4 + tagsHeight;
		
		var availableHeight = recipeBoxHeight - paddingBottom - paddingTop + gapBetweenIngredients;
		////
		var recipeBoxWidth = this.$().find(".recipe-box").width();
		var imageWidth = 5 + 134 + 5;
		var paddingRight = 5;
		var availableWidth = recipeBoxWidth - imageWidth - paddingRight + gapBetweenIngredients;
		////
		var ingredients = sortedIngredients;
		var ingredientsWithWidths = [];

		ingredients.forEach(function(item) {
			ingredientsWithWidths.push({item: item, 
				width: that.getTextWidth(item.name, "12px CenturyGothic") + 10});
		});
		ingredientsWithWidths = ingredientsWithWidths.sortBy("width");
		//
		var newOrder = [];
		var curRowWidth = 0;
		var totalHeight = 0;
		var rendererHeight = 25 + gapBetweenIngredients;
		while (totalHeight + rendererHeight <= availableHeight && ingredientsWithWidths.length !== 0)
		{
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

		if (ingredientsWithWidths.length > 0)
		{

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

		this.set("sortedIngredients", newOrder);
	},
	tags: Ember.computed({
    	get() {
    		var tags = [];
			var recipe = this.get("recipe");
			var typesToTags = this.get("typesToTags");
			var optionsToTags = this.get("optionsToTags");
			tags.push("/assets/tags/" + typesToTags[recipe.get("cocktailTypeId")]);
			recipe.get("options").forEach(function(item) {
				tags.push("/assets/tags/" + optionsToTags[item]);
			});
			return tags; 
		}
	}),
    
    click: function() {
        this.sendAction('action', this.get("recipe").get('id'));
    }
});
