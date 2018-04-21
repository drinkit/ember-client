import Ember from 'ember';
import ENV from 'ember-drink-it/config/environment';

export default Ember.Service.extend({

  host: ENV['server-path'] + '/rest',

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

  generateAllDigests: function(username, password, authHeader) {
    const allDigests = {};
    allDigests['GET'] = this.get('digestGenerator').generateDigest(username, password, 'GET', authHeader);
    allDigests['POST'] = this.get('digestGenerator').generateDigest(username, password, 'POST', authHeader);
    allDigests['PUT'] = this.get('digestGenerator').generateDigest(username, password, 'PUT', authHeader);
    allDigests['PATCH'] = this.get('digestGenerator').generateDigest(username, password, 'PATCH', authHeader);
    allDigests['DELETE'] = this.get('digestGenerator').generateDigest(username, password, 'DELETE', authHeader);
    return allDigests;
  },

  request: function(ajaxRequestBody, successHandler, errorHandler, username, password) {
    if (ajaxRequestBody.url.substring(0, 4) !== 'http') {
      ajaxRequestBody.url = this.get('host') + ajaxRequestBody.url;
    }

    var curUsername = username ? username : this.get('session').get('data').authenticated.email;
    var curPassword = password ? password : this.get('session').get('data').authenticated.password;

    const self = this;
    let digests = self.get('session').get('data').digests;
    if (this.get('session').get('isAuthenticated')) {
      this.get('session').authorize('authorizer:digest', (headerName, headerValues) => {
        if (headerValues[ajaxRequestBody.method]) {
          ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, headerName, headerValues[ajaxRequestBody.method]);
        }
      });
    }

    // ajaxRequestBody.xhrFields = {
    //   withCredentials: true
    // };

    Ember.$.ajax(ajaxRequestBody).then(function(response) {
      successHandler(response, self.get('session').get('data').digests);
    }, function(xhr, status, error) {
      if (xhr.status === 401) { // auth error
        if (curPassword) {
          if (!(digests && digests[ajaxRequestBody.method]) || self._isNonceExpired(xhr.getResponseHeader("WWW-Authenticate"))) {
            const allDigests = self.generateAllDigests(curUsername, curPassword, xhr.getResponseHeader("WWW-Authenticate"));

            self.get('session').get('data').digests = allDigests;
            digests = allDigests;

            if (self.get('session').get('isAuthenticated')) {
              self.get('session').authenticate('autheticator:digest', curUsername,
                curPassword, digests).then(function() {
                ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, 'Authorization', digests[ajaxRequestBody.method]);
                self.request(ajaxRequestBody, successHandler, errorHandler, curUsername, curPassword);
              });
            } else {
              ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, 'Authorization', digests[ajaxRequestBody.method]);
              self.request(ajaxRequestBody, successHandler, errorHandler, curUsername, curPassword);
            }
          } else {
            self.get('session').get('data').digests = {};
            if (errorHandler != null) {
              errorHandler(xhr, "Incorrect credentials", error);
            }
          }

        }
      } else {
        self.get('session').get('data').digests = {};
        if (errorHandler != null) {
          errorHandler(xhr, status, error);
        }
      }
    });
  }
});
