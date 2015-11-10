import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({

    ajax: Ember.inject.service(),
    currentUser: Ember.inject.service(),

	restore: function(data) {
        var self = this;
		if (data.email && data.password) {
			return new Ember.RSVP.Promise(function(resolve, reject) {
                Ember.run(function() {
                    resolve({email: data.email, password: data.password, digests: {}});
                    self.requestUserInfo();
                });
			});
		}
	},

	authenticate: function(email, password) {
		var self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.run(function() {
				resolve({email: email, password: password, digests: {}});
                self.requestUserInfo();
			});
		});
	},

	invalidate: function(data) {
        this.get('currentUser').unsetUser();
		return this._super.apply(this, arguments);  
	},
    
    requestUserInfo: function() {
        var self = this;
        self.get('ajax').request({
            url: "/users/me",
            method: "GET"
        }, function(response) {
            self.get('currentUser').setUser(response);
        }, function(xhr, status, error) {
            if (status === "Incorrect credentials") {
                // self.set('hasError', true);
            }
        });
    }
});