import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
	    openModal: function(modalName) {
	      return this.render(modalName, {
	        into: 'application',
	        outlet: 'modal'
	      });
	    }
	},

	sessionInvalidated: function() {
		console.log("401");
	}
});
