var DigestRequestUtil = {
	path: "http://prod-drunkedguru.rhcloud.com/rest",
	username: "",
	password: "",
	me: function(successHandler) {
		var meRequest = new digestAuthRequest('GET', this.path + "/me", this.username, this.password);
		meRequest.request(successHandler);
	},
	setCredentials: function(username, password) {
		this.username = username;
		this.password = password;
		console.log(this.username);
	}

}