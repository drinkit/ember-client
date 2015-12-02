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
          }, function(xhr, status, error) {
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
      return new Ember.RSVP.Promise(function(resolve, reject) {
        resolve({
          email: email,
          password: password,
          digests: digests
        });
      });
    } else {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.run(function() {
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
            Ember.$('#loginWindow').modal('hide');
          }, function(xhr, status, error) {
            if (status === "Incorrect credentials") {
              reject(status);
            }
          }, email, password);
        });
      });
    }
  },

  invalidate: function(data) {
    this.get('currentUser').unsetUser();
    return this._super.apply(this, arguments);
  }
});
