import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  currentUser: Ember.inject.service(),
  oauth: Ember.inject.service(),
  repository: Ember.inject.service(),

  searchableItems: [],

  actions: {
    logout: function() {
      this.get('oauth').logout();
    },

    search: function(searchString) {
      this.transitionTo('recipes', {
        queryParams: {
          search: searchString
        }
      });
    }
  },

  sessionAuthenticated: function() {
    console.log("auth success!");
  },

  sessionInvalidated: function() {
    this.get('currentUser').unsetUser();
    console.log("logout");
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('searchableItems', this.get('searchableItems'));
  },

  afterModel(model) {
    const self = this;
    let options = [];
    Ember.run.schedule('afterRender', this, function() {
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
          data: {
            criteria: JSON.stringify({
              ingredients: [],
              cocktailTypes: [],
              options: []
            })
          }
        });
      }).then((result) => {
        const user = self.get('currentUser');
        let items = result.filter(i => i.get('published') || user.get('role') == 'ADMIN').map(i => ({
          name: i.get('name'),
          route: 'recipe',
          id: i.get('id')
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
});
