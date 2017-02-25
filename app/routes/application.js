import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  currentUser: Ember.inject.service(),
  oauth: Ember.inject.service(),

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
  }
});
