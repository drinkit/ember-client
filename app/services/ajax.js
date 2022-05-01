import Service, {
  inject as service
} from '@ember/service';
import ENV from 'ember-drink-it/config/environment';
import {isUnauthorizedResponse} from 'ember-fetch/errors';

export default class AjaxService extends Service {
  host = ENV['server-path'] + '/rest';

  @service digestSession;
  @service digestGenerator;

  _addDigestHeader(ajaxRequestBody, headerName, headerValue) {
    if (ajaxRequestBody.headers) {
      ajaxRequestBody.headers[headerName] = headerValue;
    } else {
      const headers = {};
      headers[headerName] = headerValue;
      ajaxRequestBody.headers = headers;
    }

    return ajaxRequestBody;
  }

  _isNonceExpired(authResponseHeader) {
    return authResponseHeader.indexOf('stale="true"') > 0;
  }

  _getQueryString(params) {
    const esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
  }

  generateAllDigests(username, password, authHeader) {
    const allDigests = {};
    allDigests['GET'] = this.get('digestGenerator').generateDigest(username, password, 'GET', authHeader);
    allDigests['POST'] = this.get('digestGenerator').generateDigest(username, password, 'POST', authHeader);
    allDigests['PUT'] = this.get('digestGenerator').generateDigest(username, password, 'PUT', authHeader);
    allDigests['PATCH'] = this.get('digestGenerator').generateDigest(username, password, 'PATCH', authHeader);
    allDigests['DELETE'] = this.get('digestGenerator').generateDigest(username, password, 'DELETE', authHeader);
    return allDigests;
  }

  request(ajaxRequestBody, successHandler, errorHandler, username, password) {
    if (ajaxRequestBody.url.substring(0, 4) !== 'http') {
      ajaxRequestBody.url = this.get('host') + ajaxRequestBody.url;
    }

    const curUsername = username ? username : this.digestSession.data.authenticated.email;
    const curPassword = password ? password : this.digestSession.data.authenticated.password;

    const self = this;
    let digests = self.digestSession.data.digests;
    if (this.digestSession.isAuthenticated) {
    let authDigests = this.get('digestSession.data.authenticated.digests');
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
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return successHandler(null, self.digestSession.data.digests);
        }
        return response.json()
          .then(data => {
            return successHandler(data, self.digestSession.data.digests);
        });
      } else if (isUnauthorizedResponse(response)) {
        if (curPassword) {
          const authHeader = response.headers.get("www-authenticate");
          if (!(digests && digests[ajaxRequestBody.method]) || self._isNonceExpired(authHeader)) {
            const allDigests = self.generateAllDigests(curUsername, curPassword, authHeader);

            self.digestSession.data.digests = allDigests;
            digests = allDigests;

            if (self.digestSession.isAuthenticated) {
              self.digestSession.authenticate('autheticator:digest', curUsername,
                curPassword, digests).then(function() {
                ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, 'Authorization', digests[ajaxRequestBody.method]);
                self.request(ajaxRequestBody, successHandler, errorHandler, curUsername, curPassword);
              });
            } else {
              ajaxRequestBody = self._addDigestHeader(ajaxRequestBody, 'Authorization', digests[ajaxRequestBody.method]);
              self.request(ajaxRequestBody, successHandler, errorHandler, curUsername, curPassword);
            }
          } else {
            self.digestSession.data.digests = {};
            if (errorHandler != null) {
              errorHandler(response, "Incorrect credentials");
            }
          }
        } else {
          self.digestSession.data.digests = {};
          if (errorHandler != null) {
            errorHandler(response, response.status);
          }
        }
      } else {
        if (errorHandler != null) {
          errorHandler(response, response.status);
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
