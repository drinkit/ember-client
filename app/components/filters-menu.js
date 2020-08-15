import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Stickyfill from 'stickyfilljs';
import { conditional } from 'ember-awesome-macros';

export default Component.extend({
  classNames: [],
  dataOffsetTop: 180,
  dataOffsetBottom: null,
  currentUser: service(),
  tooltipsProvider: service(),

  activeClass: 'active',
  nonActiveClass: '',

  isBurningPressed: computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(1) >= 0 : false;
  }),

  isFlackyPressed: computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(5) >= 0 : false;
  }),

  isIcePressed: computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(2) >= 0 : false;
  }),

  isIBAPressed: computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(4) >= 0 : false;
  }),

  isCheckedPressed: computed('cocktailOptions.[]', function() {
    return this.get('cocktailOptions') ? this.get('cocktailOptions').indexOf(3) >= 0 : false;
  }),

  isLongTypePressed: computed('cocktailTypes.[]', function() {
    return this.get('cocktailTypes') ? this.get('cocktailTypes').indexOf(1) >= 0 : false;
  }),

  isShortTypePressed: computed('cocktailTypes.[]', function() {
    return this.get('cocktailTypes') ? this.get('cocktailTypes').indexOf(2) >= 0 : false;
  }),

  isShotTypePressed: computed('cocktailTypes.[]', function() {
    return this.get('cocktailTypes') ? this.get('cocktailTypes').indexOf(3) >= 0 : false;
  }),

  longTypeActiveClass: conditional('isLongTypePressed', 'activeClass', 'nonActiveClass'),
  shortTypeActiveClass: conditional('isShortTypePressed', 'activeClass', 'nonActiveClass'),
  shotTypeActiveClass: conditional('isShotTypePressed', 'activeClass', 'nonActiveClass'),

  burningActiveClass: conditional('isBurningPressed', 'activeClass', 'nonActiveClass'),
  flackyActiveClass: conditional('isFlackyPressed', 'activeClass', 'nonActiveClass'),
  iceActiveClass: conditional('isIcePressed', 'activeClass', 'nonActiveClass'),
  ibaActiveClass: conditional('isIBAPressed', 'activeClass', 'nonActiveClass'),
  checkedActiveClass: conditional('isCheckedPressed', 'activeClass', 'nonActiveClass'),

  actions: {
    toggleOption(id) {
      this.toggleOption(id);
    },
    toggleType(id) {
      this.toggleType(id);
    },
    changeIngredients(ingredients) {
      this.changeIngredients(ingredients);
    },
    clearFilters() {
      const activeButtons = document.querySelectorAll('#filtersMenu button.active');
      for (const btn of activeButtons) {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('active');
      }
      //
      this.set('barIngredientsIds', []);
      //
      this.clearFilters();
    },
    addBarAsFilter() {
      let barItemsIds = this.get('currentUser.barItems').filter(function(item) {
        return item.active;
      }).map(function(item) {
        return item.ingredientId;
      });
      const allIds = [...new Set(...this.get('selectedIngredientsIds'), ...barItemIds)];
      this.set('barIngredientsIds', allIds);
      this.sendAction('changeIngredients', allIds);
    }
  },
  didInsertElement: function() {
    var stickyMenu = document.querySelector('.sticky');
    Stickyfill.addOne(stickyMenu);
    // const windowHeight = window.height;
    // const offsetParentY = document.querySelector('#filtersMenu').offsetTop;
    // const offsetY = document.querySelector('#ingredientChooser').positionTop;
    // document.querySelector('#ingredientChooser > div').css('max-height', windowHeight - offsetY - 70);
  }
});
