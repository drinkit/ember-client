import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Stickyfill from 'stickyfilljs';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export default class FiltersMenu extends Component {
  @service currentUser;
  @service tooltipsProvider;

  constructor(owner, args) {
    super(owner, args);
    schedule("afterRender", this, function() {
      const stickyMenu = document.querySelector('.sticky');
      Stickyfill.addOne(stickyMenu);
    });
  }

  get isBurningPressed() {
    return this.args.cocktailOptions ? this.args.cocktailOptions.indexOf(1) >= 0 : false;
  }

  get isFlackyPressed() {
    return this.args.cocktailOptions ? this.args.cocktailOptions.indexOf(5) >= 0 : false;
  }

  get isIcePressed() {
    return this.args.cocktailOptions ? this.args.cocktailOptions.indexOf(2) >= 0 : false;
  }

  get isIBAPressed() {
    return this.args.cocktailOptions ? this.args.cocktailOptions.indexOf(4) >= 0 : false;
  }

  get isCheckedPressed() {
    return this.args.cocktailOptions ? this.args.cocktailOptions.indexOf(3) >= 0 : false;
  }

  get isLongTypePressed() {
    return this.args.cocktailTypes ? this.args.cocktailTypes.indexOf(1) >= 0 : false;
  }

  get isShortTypePressed() {
    return this.args.cocktailTypes ? this.args.cocktailTypes.indexOf(2) >= 0 : false;
  }

  get isShotTypePressed() {
    return this.args.cocktailTypes ? this.args.cocktailTypes.indexOf(3) >= 0 : false;
  }

  isIngredientExists(id) {
    return this.args.ingredients.any((item) => item.id === id);
  }

  @action
  clearFilters() {
    const activeButtons = document.querySelectorAll('#filtersMenu button.active');
    for (const btn of activeButtons) {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('active');
    }
    this.args.clearFilters();
  }

  @action
  addBarAsFilter() {
    let barItemsIds = this.currentUser.barItems.filter(function(item) {
      return item.active && this.isIngredientExists(item.ingredientId);
    }, this).map(function(item) {
      return item.ingredientId;
    });
    const allIds = [...new Set([...this.args.selectedIngredientsIds, ...barItemsIds])];
    this.args.changeIngredients(allIds);
  }
}
