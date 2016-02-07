import Ember from 'ember';

export default Ember.Component.extend({

  selectedIngredients: [],
  selectedIngredientsIds: [],

  selectedIngredientsChanged: Ember.observer('selectedIngredients.[]', function() {
    this.sendAction("changeIngredients", this.get('selectedIngredients'));
  }),

  selectedIngredientsIdsChanged: Ember.observer('selectedIngredientsIds.[]', function() {
    let self = this;
    let ingredients = this.get('selectedIngredientsIds').map(this.findIngredientByRealId, this);
    this.get('selectedIngredients').forEach(function(item) {
      item.disabled = false;
    });
    this.set('selectedIngredients', ingredients);
    ingredients.forEach(function(item) {
      item.disabled = true;
    });
  }),

  needToClearData: Ember.observer('needToClear', function() {
    if (this.get('needToClear')) {
      this.get('filteredIngredients').map(function(item) {
        item.disabled = false;
      });
      this.set('selectedIngredients', []);
      this.set('selectedIngredientsIds', []);
      this.set('needToClear', false);
    }
  }),

  filteredIngredients: Ember.computed('model.ingredients', function() {
    var expandedIngredients = [];
    var fakeIngredient;
    var counter = 0;
    var ingredients = this.get('ingredients').toArray();

    for (var i = 0; i < ingredients.length; i++) {
      var ingredient = ingredients[i];
      expandedIngredients.push({
        id: counter,
        name: ingredient.get('name'),
        description: '',
        groupId: ingredient.get('id'),
        isReal: true,
        disabled: false,
        category: ingredient.get('category')
      });

      if (ingredient.get('alias')) {
        for (var j = 0; j < ingredient.get('alias').length; j++) {
          counter++;
          var synonym = ingredient.get('alias')[j];
          expandedIngredients.push({
            id: counter,
            name: synonym,
            description: "(" + ingredient.get('name') + ")",
            groupId: ingredient.get('id'),
            isReal: false,
            disabled: false
          });
        }
      }

      counter++;
    }

    return expandedIngredients;
  }),

  findIngredientByRealId: function(id) {
    for (var i = 0; i < this.get('filteredIngredients').length; i++) {
      if (this.get('filteredIngredients')[i].groupId == id && this.get('filteredIngredients')[i].isReal) {
        return this.get('filteredIngredients')[i];
      }
    }
  },

  actions: {
    changeIngredients(ingredients) {
      if (ingredients instanceof Array) {
        var deselected = $(this.get('selectedIngredients')).not(ingredients).get();
        var selected = $(ingredients).not(this.get('selectedIngredients')).get();
      } else {
        var deselected = this.get('selectedIngredients').indexOf(ingredients) >= 0 ? [ingredients] : [];
        var selected = this.get('selectedIngredients').indexOf(ingredients) == -1 ? [ingredients] : [];
      }

      if (selected.length > 0) {
        var realSelected = this.findIngredientByRealId(selected[0].groupId);
        var allSynonyms = this.get('filteredIngredients').filter(function(item) {
          return item.groupId == realSelected.groupId;
        });

        for (var i = 0; i < allSynonyms.length; i++) {
          // if (allSynonyms[i].id != realSelected.id) {
            allSynonyms[i].disabled = true;
          // }
        }

        this.set('selectedIngredients', this.get('selectedIngredients').concat([realSelected]));
        this.sendAction('ingredientSelected', realSelected.groupId);
      } else if (deselected.length > 0) {
        var allSynonyms = this.get('filteredIngredients').filter(function(item) {
          return item.groupId == deselected[0].groupId;
        });

        for (var i = 0; i < allSynonyms.length; i++) {
          // if (allSynonyms[i].id != deselected[0].id) {
            allSynonyms[i].disabled = false;
          // }
        }

        if (ingredients instanceof Array) {
          this.set('selectedIngredients', ingredients);
        } else {
          var index = this.get('selectedIngredients').indexOf(ingredients);
          this.get('selectedIngredients').splice(index, 1);
          this.notifyPropertyChange('selectedIngredients');
        }

        this.sendAction('ingredientDeselected', deselected[0].groupId);
      }
    }
  }
});
