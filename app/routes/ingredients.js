import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import localize from "../utils/localize";

export default class IngredientsRoute extends Route {
  @service repository;
  @service headData;

  model() {
    return this.repository.find('ingredient', {
      url: '/ingredients',
      method: 'GET'
    });
  }

  afterModel(model, transition) {
    this.set('headData.title', `${localize('Ингредиенты', 'Ingredients', 'Інгредієнти')} - drinkIt`);
    this.set('headData.description', localize(
      'Конструктор для составления коктейлей. Более 300 рецептов, удобные фильтры, умный поиск. Сохранение барного листа и подбор коктейлей по содержимому бара.', // Russian
      'Cocktail constructor. More than 300 recipes, convenient filters, smart search. Saving the bar list and selecting cocktails based on the contents of the bar.', // English
      'Конструктор для складання коктейлів. Більше 300 рецептів, зручні фільтри, розумний пошук. Збереження барного листа і підбір коктейлів за вмістом бару.' // Ukrainian
    ));
    transition.then(() => {
      this.set('headData.canonical', document.location.origin + document.location.pathname);
    });
  }
}
