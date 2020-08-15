import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({

  ajax: service(),
  currentUser: service(),

  restore: function(data) {
    var self = this;
    if (data.email && data.password) {
      return new Promise(function(resolve, reject) {
        run(function() {
          self.get('ajax').request({
            url: "/users/me",
            method: "GET"
          }, function(response, digests) {
            resolve({
              email: data.email,
              password: data.password,
              digests: digests
            });
            self.get('currentUser').setUser(response);
          }, function(response, status) {
            if (status === "Incorrect credentials") {
              reject();
            }
          }, data.email, data.password);
        });
      });
    }
  },

  authenticate: function(email, password, digests) {
    var self = this;
    if (digests) {
      return new Promise(function(resolve, reject) {
        resolve({
          email: email,
          password: password,
          digests: digests
        });
      });
    } else {
      return new Promise(function(resolve, reject) {
        run(function() {
          self.get('ajax').request({
            url: "/users/me",
            method: "GET"
          }, function(response, digests) {
            resolve({
              email: email,
              password: password,
              digests: digests
            });
            self.get('currentUser').setUser(response);
          }, function(response, status) {
            if (status === "Incorrect credentials") {
              reject(status);
            }
          }, email, password);
        });
      });
    }
  },

  invalidate: function(data) {
    return this._super.apply(this, arguments);
  }
});
