import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	currentUser: Ember.inject.service('current-user'),
	ajax: Ember.inject.service('ajax'),

	actions: {
	    authSuccess: function() {
	    	var self = this;
	    	self.get('ajax').request({
	    		url: "http://prod-drunkedguru.rhcloud.com/rest/users/me",
	    		method: "GET"
	    	}, function(response) {
	    		Ember.$('#loginWindow').modal('hide');
	    		self.get('currentUser').setUser(response);
	    	}, function(xhr, status, error) {
	    		if (status === "Incorrect credentials") {
	    			self.set('hasError', true);
	    		}
	    	});
	    	
	    }
	},

	sessionAuthenticated: function() {
		console.log("auth success!");
	},

	sessionInvalidated: function() {
		console.log("401");
	}
});
