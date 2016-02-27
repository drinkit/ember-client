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
    ingredients = ingredients.filter(Boolean);
    this.get('selectedIngredients').forEach(function(item) {
      Ember.set(item, 'disabled', false);
    });
    this.set('selectedIngredients', ingredients);
    ingredients.forEach(function(item) {
      Ember.set(item, 'disabled', true);
    });
  }),

  filteredIngredients: Ember.computed('model.ingredients', function() {
    var expandedIngredients = [];
    var counter = 0;
    var ingredients = this.get('ingredients').toArray();

    for (var i = 0; i < ingredients.length; i++) {
      var ingredient = ingredients[i];
      expandedIngredients.push({
        id: counter,
        name: ingredient.get('name').toLowerCase(),
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
            name: synonym.toLowerCase(),
            description: "(" + ingredient.get('name').toLowerCase() + ")",
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

  getAllSynonyms: function(id) {
    return this.get('filteredIngredients').filter(function(item) {
      return item.groupId == id;
    });
  },

  actions: {
    changeIngredients(ingredients) {
      let selected, deselected;
      if (ingredients instanceof Array) {
        deselected = $(this.get('selectedIngredients')).not(ingredients).get();
        selected = $(ingredients).not(this.get('selectedIngredients')).get();
      } else {
        deselected = this.get('selectedIngredients').indexOf(ingredients) >= 0 ? [ingredients] : [];
        selected = this.get('selectedIngredients').indexOf(ingredients) === -1 ? [ingredients] : [];
      }

      if (selected.length > 0) {
        var realSelected = this.findIngredientByRealId(selected[0].groupId);
        var allSynonyms = this.getAllSynonyms(realSelected.groupId);

        for (var i = 0; i < allSynonyms.length; i++) {
          Ember.set(allSynonyms[i], 'disabled', true);
        }

        this.set('selectedIngredients', this.get('selectedIngredients').concat([realSelected]));
        this.sendAction('ingredientSelected', realSelected.groupId);
      } else if (deselected.length > 0) {
        var allSynonyms = this.getAllSynonyms(deselected[0].groupId);

        for (var i = 0; i < allSynonyms.length; i++) {
          Ember.set(allSynonyms[i], 'disabled', false);
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
