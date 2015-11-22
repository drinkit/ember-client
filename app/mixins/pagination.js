import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ["pageNumber"],
  pageNumber: 0,
  pageSize: 16,

  nextPageNumber: function() {
    return this.get("pageNumber") + 1;
  }.property("pageNumber", "pages"),

  previousPageNumber: function() {
    return this.get("pageNumber") - 1;
  }.property("pageNumber", "pages"),

  isNextPageExist: function() {
    return this.get("pageNumber") + 1 < this.get("pages").length;
  }.property("pageNumber", "pages"),

  isPreviousPageExist: function() {
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
  }.property('pages', 'pageNumber')

});
