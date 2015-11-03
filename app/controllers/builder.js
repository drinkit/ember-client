import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
	queryParams: ["pageNumber"],
	cocktailTypes: [],
	cocktailOptions: [],
	selectedIngredients: [],
	pageNumber: 0,
	pageSize: 16,

	nextPageNumber: function() {
		return this.get("pageNumber") + 1;
	}.property("pageNumber", "pages"),

	previousPageNumber: function() {
		return this.get("pageNumber") - 1;
	}.property("pageNumber", "pages"),

	isNextPageExist: function () {
		return this.get("pageNumber") + 1 < this.get("pages").length;
	}.property("pageNumber", "pages"),

	isPreviousPageExist: function () {
		return this.get("pageNumber") - 1 >= 0 && this.get("pages").length > 0;
	}.property("pageNumber", "pages"),

    pages: function() {
        var pages = [];
        var that = this;
        if (this.get('recipes') != null) {
            var allRecipes = this.get('recipes');
            var index = 0;
            var curPageIndex = 0;
            while (index < allRecipes.get("length")) {
            	var page = [];
            	while (index < (curPageIndex + 1) * that.get("pageSize") && index < allRecipes.get("length")) {
            		page.push(allRecipes.objectAt(index));
            		index++;
            	}
            	pages.push(page);
            	curPageIndex++;
            }
        }
        return pages;
    }.property('recipes.[]', 'pageSize'), 

	recipesOnPage: function() {
		return this.get('pages')[this.get('pageNumber')];
	}.property('pages', 'pageNumber'),

	performSearch: function() {
		var that = this;
        this.get('session').authorize('authorizer:digest', (headerName, headerValue) => {
            const headers = {};
            headers[headerName] = headerValue;
            Ember.$.ajax({
                url: "http://prod-drunkedguru.rhcloud.com/rest/recipes",
                method: "GET",
                data: {
                    criteria: JSON.stringify({
                        ingredients: this.get("selectedIngredients"),
                        cocktailTypes: this.get("cocktailTypes"),
                        options: this.get("cocktailOptions")
                    })
                },
                headers: headers
            }).then(function(result) {
                result = result.map(function(item) {
                    if (item.thumbnailUrl) {
                        item.thumbnailUrl = "http://prod-drunkedguru.rhcloud.com" + item.thumbnailUrl;
                    }

                    return item;
                });

                that.store.unloadAll("recipe");

                result.forEach(function(item) {
                    that.store.push(that.store.normalize("recipe", item));
                });
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
