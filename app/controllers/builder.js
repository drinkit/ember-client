import Ember from 'ember';

export default Ember.Controller.extend({
	cocktailTypes: [],
	cocktailOptions: [],
	selectedIngredients: [],
	performSearch: function() {
		var that = this;
		Ember.$.ajax({
			url: "http://prod-drunkedguru.rhcloud.com/rest/recipes",
			method: "GET",
			data: {
				criteria: JSON.stringify({
					ingredients: this.get("selectedIngredients"),
					cocktailTypes: this.get("cocktailTypes"),
					options: this.get("cocktailOptions")
				})
			}
		}).then(function(result) {
			result = result.map(function(item) {
				if (item.thumbnailUrl) {
					item.thumbnailUrl = "http://prod-drunkedguru.rhcloud.com" + item.thumbnailUrl;
				}

				return item;
			});

			that.store.unloadAll("recipe");

			result.forEach(function(item) {
				that.store.pushPayload("recipe", {"recipe": item});
			});
		});
	},
	actions: {
		toggleOption(id) {
			var options = this.get("cocktailOptions");
			var index = options.indexOf(id);

            if (index >= 0) {
            	options.splice(index, 1);
            } else {
            	options.push(id);
            }

            this.set("cocktailOptions", options);
            this.performSearch();
		},

		toggleType(id) {
			var types = this.get("cocktailTypes");
			var index = types.indexOf(id);

            if (index >= 0) {
            	types.splice(index, 1);
            } else {
            	types.push(id);
            }

            this.set("cocktailTypes", types);
            this.performSearch();
		},

		doSearch() {
			this.performSearch();
		}
	}
});
