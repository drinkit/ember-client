import Service, {
  inject as service
} from '@ember/service';
import ENV from 'ember-drink-it/config/environment';
import fetch from 'fetch';
import {isUnauthorizedResponse} from 'ember-fetch/errors';

export default Service.extend({

  host: ENV['server-path'] + '/rest',

  session: service('session'),
  digestGenerator: service('digest-generator'),

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

  _getQueryString: function(params) {
    var esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
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
    let authDigests = this.get('session.data.authenticated.digests');
      if (authDigests && authDigests[ajaxRequestBody.method]) {
        ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, "Authorization", authDigests[ajaxRequestBody.method]);
      }
    }


    if (ajaxRequestBody.method === 'GET' && ajaxRequestBody.body) {
      ajaxRequestBody.url += '?' + self._getQueryString(ajaxRequestBody.body);
      ajaxRequestBody.body = null;
    }

    fetch(ajaxRequestBody.url, ajaxRequestBody).then(function(response) {
      if (response.ok) {
        if (response.status === 204) {
          return successHandler(null, self.get('session').get('data').digests);
        } else {
          return response.json().then(function(data) {
            return successHandler(data, self.get('session').get('data').digests);
          });
        }
      } else if (isUnauthorizedResponse(response)) {
        if (curPassword) {
          const authHeader = response.headers.get("www-authenticate");
          if (!(digests && digests[ajaxRequestBody.method]) || self._isNonceExpired(authHeader)) {
            const allDigests = self.generateAllDigests(curUsername, curPassword, authHeader);

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
              errorHandler(response, "Incorrect credentials");
            }
          }
        } else {
          self.get('session').get('data').digests = {};
          if (errorHandler != null) {
            errorHandler(response, status, error);
          }
        }
      }
    });
  }
});
