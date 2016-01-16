import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["col-md-3"],
  dataOffsetTop: 185,
  dataOffsetBottom: null,
  selectedFakeIngredients: [],

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
        disabled: false
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

  selectedRealIngredients: Ember.computed('selectedFakeIngredients.[]', function() {
    var self = this;
    if (this.get('selectedFakeIngredients')) {
      return this.get('selectedFakeIngredients').map(function(item) {
        return item.groupId;
      });
    } else {
      return [];
    }
  }),

  actions: {
    toggleOption(id) {
        this.sendAction("toggleOption", id);
      },
      toggleType(id) {
        this.sendAction("toggleType", id);
      },
      changeIngredients(ingredients) {
        var deselected = $(this.get('selectedFakeIngredients')).not(ingredients).get();
        var selected = $(ingredients).not(this.get('selectedFakeIngredients')).get();

        if (selected.length > 0) {
          var realSelected = this.findIngredientByRealId(selected[0].groupId);
          var allSynonyms = this.get('filteredIngredients').filter(function(item) {
            return item.groupId == realSelected.groupId;
          });

          for (var i = 0; i < allSynonyms.length; i++) {
            if (allSynonyms[i].id != realSelected.id) {
              allSynonyms[i].disabled = true;
            }
          }

          this.set('selectedFakeIngredients', this.get('selectedFakeIngredients').concat([realSelected]));
        } else if (deselected.length > 0) {
          var allSynonyms = this.get('filteredIngredients').filter(function(item) {
            return item.groupId == deselected[0].groupId;
          });

          for (var i = 0; i < allSynonyms.length; i++) {
            if (allSynonyms[i].id != deselected[0].id) {
              allSynonyms[i].disabled = false;
            }
          }

          this.set('selectedFakeIngredients', ingredients);
        }

        this.sendAction("changeIngredients", this.get('selectedRealIngredients'));
      },
      clearFilters() {
        this.$('#filtersMenu button.active').attr('aria-pressed', "false");
        this.$('#filtersMenu button.active').button('refresh');
        this.$('#filtersMenu button.active').removeClass('active');
        //
        this.get('filteredIngredients').map(function(item) {
          item.disabled = false;
        });
        this.set('selectedFakeIngredients', []);
        //
        this.sendAction("clearFilters");
      }
  },
  didInsertElement: function() {
    var options = {
      offset: {
        top: this.get('dataOffsetTop'),
        bottom: this.get('dataOffsetBottom')
      }
    };
    this.$("#filtersMenu").affix(options);
    this.setListenerOnChosen();
  },
  setListenerOnChosen: function() {
    var self = this;
    this.$('.ember-chosen select').chosen().change(function(event, params) {
      if (params.selected) {
        var selectedElements = self.$('.ember-chosen select').val();
        var lastSelectedId = selectedElements.pop();
        var lastSelected = self.get('filteredIngredients')[lastSelectedId];
        var realSelected = self.findIngredientByRealId(lastSelected.groupId);
        selectedElements.push(realSelected.id);
        var allSynonyms = self.get('filteredIngredients').filter(function(item) {
          return item.groupId == realSelected.groupId;
        });
        for (var i = 0; i < allSynonyms.length; i++) {
          if (allSynonyms[i].id != realSelected.id) {
            self.$('.ember-chosen select option[value=' + allSynonyms[i].id + ']').prop("disabled", true);
          }
        }
        self.$('.ember-chosen select').val(selectedElements).trigger('chosen:updated');
      } else {
        var lastDeselectedId = params.deselected;
        var lastDeselected = self.get('filteredIngredients')[lastDeselectedId];
        var allSynonyms = self.get('filteredIngredients').filter(function(item) {
          return item.groupId == lastDeselected.groupId;
        });
        for (var i = 0; i < allSynonyms.length; i++) {
          if (allSynonyms[i] != lastDeselected.id) {
            self.$('.ember-chosen select option[value=' + allSynonyms[i].id + ']').prop("disabled", false);
          }
        }
      }

    });
  },
  findIngredientByRealId: function(id) {
    for (var i = 0; i < this.get('filteredIngredients').length; i++) {
      if (this.get('filteredIngredients')[i].groupId == id && this.get('filteredIngredients')[i].isReal) {
        return this.get('filteredIngredients')[i];
      }
    }
  }
});
