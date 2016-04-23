import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'ember-drink-it/config/environment';

export default DS.RESTAdapter.extend({
  authorizer: 'authorizer:digest',
  host: ENV['server-path'],
  namespace: 'rest',

  session: Ember.inject.service(),
  digestGenerator: Ember.inject.service(),

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

  shouldReloadAll() {
    return true;
  },

  ajaxOptions() {
    const authorizer = this.get('authorizer');

    let hash = this._super(...arguments);
    let {
      beforeSend
    } = hash;

    hash.beforeSend = (xhr) => {
      if (beforeSend) {
        beforeSend(xhr);
      }

      this.get('session').authorize(authorizer, (headerName, headerValues) => {
        xhr.setRequestHeader(headerName, headerValues[hash.type]);
      });
    };
    return hash;
  },

  handleResponse(status, headers, payload, requestData) {
    if (status != "401") {
      return this._super(...arguments);
    }

    let self = this;

    if (this._isNonceExpired(headers["WWW-Authenticate"])) {
      const curUsername = this.get('session').get('data').authenticated.email;
      const curPassword = this.get('session').get('data').authenticated.password;
      const allDigests = this.generateAllDigests(curUsername, curPassword, headers["WWW-Authenticate"]);

      this.get('session').get('data').digests = allDigests;
      const digests = allDigests;

      if (this.get('session').get('isAuthenticated')) {
        this.get('session').authenticate('autheticator:digest', curUsername,
          curPassword, digests).then(function() {
          self.ajax(requestData.url, requestData.method).then(response => {
            return response;
          }, response => {
            return response;
          });
        });
      };
    }
  }
});
