import Ember from 'ember';

export default Ember.Service.extend({

    host: "http://prod-drunkedguru.rhcloud.com/rest/",

	session: Ember.inject.service('session'),
	digestGenerator: Ember.inject.service('digest-generator'),

	request: function(ajaxRequestBody, successHandler, errorHandler, username, password) {
        if (ajaxRequestBody.url.substring(0, 4) != 'http') {
            ajaxRequestBody.url = this.get('host') + ajaxRequestBody.url;
        }
        
        var curUsername = username ? username : this.get('session').get('data').authenticated.email;
        var curPassword = password ? password : this.get('session').get('data').authenticated.password;
            
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
		} else if (self.get('session').get('data').digests && self.get('session').get('data').digests[ajaxRequestBody.method]) {
                if (ajaxRequestBody.headers) {
                    ajaxRequestBody.headers['Authorization'] = self.get('session').get('data').digests[ajaxRequestBody.method];
                } else {
                    var headers = {};
                    headers['Authorization'] = self.get('session').get('data').digests[ajaxRequestBody.method];
                    ajaxRequestBody.headers = headers;
                }
        }

		var promise = Ember.$.ajax(ajaxRequestBody);
		promise.then(function(response) {
			successHandler(response, self.get('session').get('data').digests);
		}, function(xhr, status, error) {
			if (xhr.status === 401) {
				if (curUsername && curPassword) {
					if (self.get('session').get('data').digests && self.get('session').get('data').digests[ajaxRequestBody.method]) {
						self.get('session').get('data').digests = {};
						errorHandler(xhr, "Incorrect credentials", error);
					} else {
						var digestHeader = self.get('digestGenerator').generateDigest(curUsername, 
							curPassword, ajaxRequestBody.method, 
							xhr.getResponseHeader("WWW-Authenticate"));

                        if (self.get('session').get('data').digests) {
                            self.get('session').get('data').digests[ajaxRequestBody.method] = digestHeader;
                        } else {
                            self.get('session').get('data').digests = {};
                            self.get('session').get('data').digests[ajaxRequestBody.method] = digestHeader;
                        }
                            
                            
						self.request(ajaxRequestBody, successHandler, errorHandler, curUsername, curPassword);
					}

				}
			} else {
                self.get('session').get('data').digests = {};
				errorHandler(xhr, status, error);
			}
		});
	}
});
