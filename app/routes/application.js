import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  title: function(tokens) {
    return 'drinkIt - ' + tokens.join(' - ');
  },

  actions: {
    logout: function() {
      this.get('session').invalidate();
      this.get('session').get('data').digests = {};
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
  }
});
