import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  currentUser: Ember.inject.service(),
  oauth: Ember.inject.service(),
  repository: Ember.inject.service(),

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

  afterModel(model) {
    const self = this;
    let options = [];
    Ember.run.schedule('afterRender', this, function() {
      const repository = self.get('repository');
      repository.find('ingredient', {
        url: '/ingredients',
        method: 'GET'
      }).then((result) => {
        let items = result.map(i => i.get('name'));
        options.push({groupName: 'Ингредиенты', options: items});
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
        let items = result.filter(i => i.get('published') || user.get('role') == 'ADMIN').map(i => i.get('name'));
        options.unshift({groupName: 'Коктейли', options: items});
        self.get('controller').set('searchableItems', options);
      });
    });
  }
});
