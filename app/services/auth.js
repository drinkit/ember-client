import Ember from 'ember';

export default Ember.Service.extend({
    path: "http://prod-drunkedguru.rhcloud.com/rest",
    username: "",
    password: "",
    
    me(successHandler) {
        var meRequest = new digestAuthRequest('GET', this.path + "/me", this.username, this.password);
		meRequest.request(successHandler);
    },
    
    setCredentials(username, password) {
		this.username = username;
		this.password = password;
		console.log(this.username);
	}
});
