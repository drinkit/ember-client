import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	session: Ember.inject.service(),

	actions: {
	    logout: function() {
            this.get('session').invalidate();
	    }
	},

	sessionAuthenticated: function() {
		console.log("auth success!");
        Ember.$('#loginWindow').modal('hide');
	},

	sessionInvalidated: function() {
		console.log("logout");
	}
});
