import Ember from 'ember';

export default Ember.Service.extend({

  host: "http://prod-drunkedguru.rhcloud.com/rest/",

  session: Ember.inject.service('session'),
  digestGenerator: Ember.inject.service('digest-generator'),

  _addDigestHeader: function(ajaxRequestBody, headerName, headerValue) {
    if (ajaxRequestBody.headers) {
      ajaxRequestBody.headers[headerName] = headerValue;
    } else {
      var headers = {};
      headers[headerName] = headerValue;
      ajaxRequestBody.headers = headers;
    }

    return ajaxRequestBody;
  },

  _isNonceExpired: function(authResponseHeader) {
    return authResponseHeader.indexOf('stale="true"') > 0;
  },

  request: function(ajaxRequestBody, successHandler, errorHandler, username, password) {
    if (ajaxRequestBody.url.substring(0, 4) != 'http') {
      ajaxRequestBody.url = this.get('host') + ajaxRequestBody.url;
    }

    var curUsername = username ? username : this.get('session').get('data').authenticated.email;
    var curPassword = password ? password : this.get('session').get('data').authenticated.password;

    var self = this;
    var digests = self.get('session').get('data').digests;
    if (this.get('session').get('isAuthenticated')) {
      this.get('session').authorize('authorizer:digest', (headerName, headerValues) => {
        if (headerValues[ajaxRequestBody.method]) {
          ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, headerName, headerValues[ajaxRequestBody.method]);
        }
      });
    }

    Ember.$.ajax(ajaxRequestBody).then(function(response) {
      successHandler(response, self.get('session').get('data').digests);
    }, function(xhr, status, error) {
      if (xhr.status === 401) { // auth error
        if (curUsername && curPassword) {
          if (!(digests && digests[ajaxRequestBody.method]) || self._isNonceExpired(xhr.getResponseHeader("WWW-Authenticate"))) {
            var digestHeader = self.get('digestGenerator').generateDigest(curUsername,
              curPassword, ajaxRequestBody.method,
              xhr.getResponseHeader("WWW-Authenticate"));

            if (!self.get('session').get('data').digests) {
              self.get('session').get('data').digests = {};
              digests = self.get('session').get('data').digests;
            }

            digests[ajaxRequestBody.method] = digestHeader;

            if (self.get('session').get('isAuthenticated')) {
              self.get('session').invalidate().then(function() {
                self.get('session').authenticate('autheticator:digest', curUsername,
          				curPassword, digests).then(function() {
                    ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, 'Authorization', digests[ajaxRequestBody.method]);
                    self.request(ajaxRequestBody, successHandler, errorHandler, curUsername, curPassword);
                  });
              });
            } else {
              ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, 'Authorization', digests[ajaxRequestBody.method]);
              self.request(ajaxRequestBody, successHandler, errorHandler, curUsername, curPassword);
            }
          } else {
            self.get('session').get('data').digests = {};
            errorHandler(xhr, "Incorrect credentials", error);
          }

        }
      } else {
        self.get('session').get('data').digests = {};
        errorHandler(xhr, status, error);
      }
    });
  }
});
