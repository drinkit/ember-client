import Ember from 'ember';

export default Ember.Service.extend({
	session: Ember.inject.service("session"),

	username: "",
	password: "",
	displayName: "",
	accessLevel: -1,
	isLoggedIn: false,

	isAuthenticated: function () {
		return this.get("isLoggedIn") && this.get('session').isAuthenticated;
	}.property('isLoggedIn', 'session.isAuthenticated'),

	setUser: function(userInfo) {
		this.set("username", userInfo.username);
		this.set("password", userInfo.password);
		this.set("displayName", userInfo.displayName);
		this.set("accessLevel", userInfo.accessLevel);
		this.set("isLoggedIn", true);
	}
});
