import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["col-md-3"],
  dataOffsetTop: 185,
  dataOffsetBottom: null,

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
        caption: ingredient.get('name'),
        groupId: ingredient.get('id'),
        isReal: true,
        locked: false
      });

      if (ingredient.get('alias')) {
        for (var j = 0; j < ingredient.get('alias').length; j++) {
          counter++;
          var synonym = ingredient.get('alias')[j];
          expandedIngredients.push({
            id: counter,
            name: synonym,
            caption: synonym + " (" + ingredient.get('name') + ")",
            groupId: ingredient.get('id'),
            isReal: false,
            locked: false
          });
        }
      }

      counter++;
    }

    return expandedIngredients;
  }),

  selectedRealIngredients: Ember.computed('selectedFakeIngredients', function(key, value) {
    var self = this;
    if (arguments.length > 1) {
      return value;
    }
    return this.get('selectedFakeIngredients').map(function(item) {
      return self.get('filteredIngredients')[item].groupId;
    });
  }),

  actions: {
    toggleOption(id) {
        this.sendAction("toggleOption", id);
      },
      toggleType(id) {
        this.sendAction("toggleType", id);
      },
      changeIngredients() {
        this.sendAction("changeIngredients", this.get('selectedRealIngredients'));
      },
      clearFilters() {
        this.$('#filtersMenu button.active').attr('aria-pressed', "false");
        this.$('#filtersMenu button.active').button('refresh');
        this.$('#filtersMenu button.active').removeClass('active');
        this.$('.ember-chosen option').prop('selected', false).trigger('chosen:updated');
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
    this.$('.ember-chosen select').chosen().change(function() {
      var selectedElements = self.$('.ember-chosen select').val();
      if (selectedElements) {
        var lastSelectedId = selectedElements.pop();
        var lastSelected = self.get('filteredIngredients')[lastSelectedId];
        var realSelected = self.findIngredientByRealId(lastSelected.groupId);
        selectedElements.push(realSelected.id);
        self.$('.ember-chosen select').val(selectedElements).trigger('chosen:updated');
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
