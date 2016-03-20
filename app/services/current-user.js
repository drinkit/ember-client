import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service("session"),

  id: "",
  username: "",
  password: "",
  displayName: "",
  accessLevel: -1,
  barItems: [],
  likes: [],
  isLoggedIn: false,

  isAuthenticated: function() {
    return this.get("isLoggedIn") && this.get('session').isAuthenticated;
  }.property('isLoggedIn', 'session.isAuthenticated'),

  setUser: function(userInfo) {
    this.set("id", userInfo.id);
    this.set("username", userInfo.username);
    this.set("password", userInfo.password);
    this.set("displayName", userInfo.displayName);
    this.set("accessLevel", userInfo.accessLevel);
    this.set("barItems", userInfo.barItems);
    this.set("likes", userInfo.likes || []);
    this.set("isLoggedIn", true);
  },

  unsetUser: function() {
    this.set("id", "");
    this.set("username", "");
    this.set("password", "");
    this.set("displayName", "");
    this.set("accessLevel", -1);
    this.set("barItems", []);
    this.set("likes", []);
    this.set("isLoggedIn", false);
  }
});
