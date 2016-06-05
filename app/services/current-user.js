import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service("session"),

  username: "",
  password: "",
  displayName: "",
  role: "",
  barItems: [],
  recipeStatsMap: {},
  isLoggedIn: false,

  isAuthenticated: function() {
    return this.get("isLoggedIn") && this.get('session').isAuthenticated;
  }.property('isLoggedIn', 'session.isAuthenticated'),

  setUser: function(userInfo) {
    this.set("username", userInfo.username);
    this.set("password", userInfo.password);
    this.set("displayName", userInfo.displayName);
    this.set("role", userInfo.role);
    this.set("barItems", userInfo.barItems);
    this.set("recipeStatsMap", userInfo.recipeStatsMap || {});
    this.set("isLoggedIn", true);
  },

  unsetUser: function() {
    this.set("username", "");
    this.set("password", "");
    this.set("displayName", "");
    this.set("role", "");
    this.set("barItems", []);
    this.set("recipeStatsMap", {});
    this.set("isLoggedIn", false);
  }
});
