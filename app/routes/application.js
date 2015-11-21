import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service(),

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
    console.log("logout");
  }
});
