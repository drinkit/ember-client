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
	getTextWidth: function(text, font) {
	    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	    var context = canvas.getContext("2d");
	    context.font = font;
	    var metrics = context.measureText(text);
	    return metrics.width;
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
	sortedIngredients: Ember.computed({
		get() {
			var sortedIngredients = [];
			var selectedIngredients = this.get("selectedIngredients");
			var store = this.get("store");
			var recipe = this.get("recipe");
			var ingredients = recipe.get("cocktailIngredients");
			ingredients.forEach(function(item) {
				var ingr = store.peekRecord("ingredient", item[0]);
				var type = selectedIngredients.contains(ingr.get("id").toString()) ? "selected-ingredient" : "unselected-ingredient";
				sortedIngredients.push({
					name: ingr.get("name"),
					className: type
				});
			});
			return sortedIngredients;
		}
	})
});
