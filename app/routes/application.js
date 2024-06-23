import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { getFirstSupportedLanguage } from '../utils/localize';

export default class ApplicationRoute extends Route {
  @service repository;
  @service digestSession;
  @service dayjs;

  searchableItems = [];

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('searchableItems', this.get('searchableItems'));
  }

  async beforeModel() {
    await this.digestSession.setup();
    this.dayjs.setLocale(getFirstSupportedLanguage());
  }

  afterModel(model) {
    const self = this;
    let options = [];
    schedule('afterRender', this, function() {
      const repository = self.get('repository');
      repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }).then((result) => {
        let items = result.map(i => ({
          name: i.get('name'),
          route: 'ingredient',
          id: i.get('id')
        }));
        options.push({
          groupName: 'Ингредиенты',
          options: items
        });
        return repository.find('recipe', {
          url: '/recipes',
          method: 'GET',
          body: {
            criteria: JSON.stringify({
              ingredients: [],
              cocktailTypes: [],
              options: []
            })
          }
        });
      }).then((result) => {
        let items = result.map(i => ({
          name: i.get('name'),
          route: 'recipe',
          id: i.get('id'),
          published: i.get('published')
        }));
        options.unshift({
          groupName: 'Коктейли',
          options: items
        });
        self.set('searchableItems', options);
        if (self.get('controller')) {
          self.get('controller').set('searchableItems', options);
        }
      });
    });
  }
}
