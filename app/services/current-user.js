import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Service.extend({
  session: service("session"),

  username: "",
  password: "",
  displayName: "",
  role: "",
  barItems: A(),
  recipeStatsMap: {},
  isLoggedIn: false,

  isAuthenticated: computed('isLoggedIn', 'session.isAuthenticated', function() {
    return this.get("isLoggedIn") && this.get('session').isAuthenticated;
  }),

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
    this.set("barItems", A());
    this.set("recipeStatsMap", {});
    this.set("isLoggedIn", false);
  }
});
