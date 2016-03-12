import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['col-md-3', 'col-sm-5'],
  dataOffsetTop: 185,
  dataOffsetBottom: null,
  currentUser: Ember.inject.service(),

  isBurningPressed: Ember.computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(1) >= 0 : false;
  }),

  isFlackyPressed: Ember.computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(5) >= 0 : false;
  }),

  isIcePressed: Ember.computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(2) >= 0 : false;
  }),

  isIBAPressed: Ember.computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(4) >= 0 : false;
  }),

  isCheckedPressed: Ember.computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(3) >= 0 : false;
  }),

  isLongTypePressed: Ember.computed('cocktailTypes.[]', function() {
    return this.get('cocktailTypes') ? this.get('cocktailTypes').indexOf(1) >= 0 : false;
  }),

  isShortTypePressed: Ember.computed('cocktailTypes.[]', function() {
    return this.get('cocktailTypes') ? this.get('cocktailTypes').indexOf(2) >= 0 : false;
  }),

  isShotTypePressed: Ember.computed('cocktailTypes.[]', function() {
    return this.get('cocktailTypes') ? this.get('cocktailTypes').indexOf(3) >= 0 : false;
  }),

  actions: {
    toggleOption(id) {
      this.sendAction("toggleOption", id);
    },
    toggleType(id) {
      this.sendAction("toggleType", id);
    },
    changeIngredients(ingredients) {
      this.sendAction('changeIngredients', ingredients);
    },
    clearFilters() {
      this.$('#filtersMenu button.active').attr('aria-pressed', 'false');
      this.$('#filtersMenu button.active').button('refresh');
      this.$('#filtersMenu button.active').removeClass('active');
      //
      this.set('barIngredientsIds', []);
      //
      this.sendAction('clearFilters');
    },
    addBarAsFilter() {
      let barItemsIds = this.get('currentUser').get('barItems').filter(function(item) {
        return item.active;
      }).map(function(item) {
        return item.ingredientId;
      });
      this.set('barIngredientsIds', barItemsIds);
    }
  },
  didInsertElement: function() {
    var options = {
      offset: {
        top: this.get('dataOffsetTop'),
        bottom: this.get('dataOffsetBottom')
      }
    };
    this.$('#filtersMenu').affix(options);
    const windowHeight = this.$(window).height();
    const offsetParentY = this.$('#filtersMenu').offset().top;
    const offsetY = this.$('#ingredientChooser').position().top;
    this.$('#ingredientChooser > div').css('max-height', windowHeight - offsetY - 70);
  }
});
