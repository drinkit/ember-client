import Ember from 'ember';

export default Ember.Service.extend({

    host: "http://prod-drunkedguru.rhcloud.com/rest/",

	session: Ember.inject.service('session'),
	digestGenerator: Ember.inject.service('digest-generator'),

	request: function(ajaxRequestBody, successHandler, errorHandler) {
        if (ajaxRequestBody.url.substring(0, 4) != 'http') {
            ajaxRequestBody.url = this.get('host') + ajaxRequestBody.url;
        }
            
		var self = this;
		if (this.get('session').get('isAuthenticated')) {
			this.get('session').authorize('authorizer:digest', (headerName, headerValues) => {
				if (headerValues[ajaxRequestBody.method]) {
					if (ajaxRequestBody.headers) {
						ajaxRequestBody.headers[headerName] = headerValues[ajaxRequestBody.method];
					} else {
						var headers = {};
						headers[headerName] = headerValues[ajaxRequestBody.method];
						ajaxRequestBody.headers = headers;
					}
				}
			});
		}

		var promise = Ember.$.ajax(ajaxRequestBody);
		promise.then(function(response) {
			successHandler(response);
		}, function(xhr, status, error) {
			if (xhr.status === 401) {
				if (self.get('session').get('data').authenticated.email && 
					self.get('session').get('data').authenticated.password) {
					if (self.get('session').get('data').authenticated.digests[ajaxRequestBody.method]) {
						self.get('session').get('data').authenticated.digests = {};
						errorHandler(xhr, "Incorrect credentials", error);
					} else {
						var digestHeader = self.get('digestGenerator').generateDigest(self.get('session').get('data').authenticated.email, 
							self.get('session').get('data').authenticated.password, ajaxRequestBody.method, 
							xhr.getResponseHeader("WWW-Authenticate"));

						self.get('session').get('data').authenticated.digests[ajaxRequestBody.method] = digestHeader;
						self.request(ajaxRequestBody, successHandler, errorHandler);
					}

				}
			} else {
				errorHandler(xhr, status, error);
			}
		});
	}
});
