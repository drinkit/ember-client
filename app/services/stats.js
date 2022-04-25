import Service, { inject as service } from '@ember/service';

export default class StatsService extends Service {
  @service ajax;
  @service simpleStore;

  incrementViewsCount(recipeId) {
    const store = this.simpleStore;
    this.ajax.request({
      method: 'PATCH',
      url: '/users/me/recipeStats/' + recipeId + '/views?inc=1'
    }, () => {
      let recipe = store.find('recipe', recipeId);
      if (recipe.get('stats') == null) {
        recipe.set('stats', {views: 0, likes: 0});
      }
      recipe.set('stats.views', recipe.get('stats.views') + 1);
    }, () => {
      // do nothing
    });
  }
}
