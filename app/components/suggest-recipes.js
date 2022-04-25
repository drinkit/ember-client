import Component from '@glimmer/component';

export default class SuggestRecipes extends Component {
  maxRecipes = 6;

  get filteredSuggestedRecipes() {
    return this.args.suggestedRecipes ? this.args.suggestedRecipes.slice(0, this.maxRecipes) : [];
  }

  get hasData() {
    return this.filteredSuggestedRecipes.length > 0;
  }
}
