import Ember from 'ember';

export default Ember.Service.extend({
	session: Ember.inject.service('session'),

	request: function(ajaxRequestBody) {
		if (this.get('session').isAuthenticated) {
			this.get('session').authorize('authorizer:digest', (headerName, headerValue) => {
				if (ajaxRequestBody.headers) {
					ajaxRequestBody.headers[headerName] = headerValue;
				} else {
					var headers = {};
					headers[headerName] = headerValue;
					ajaxRequestBody.headers = headers;
				}
					
                return Ember.$.ajax(ajaxRequestBody);
			});
		} else {
            return Ember.$.ajax(ajaxRequestBody);
        }

		
	}
});
