import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({
	restore(data) {
	  //
	},

	authenticate(email, password) {
	  console.log(email, password);
	  return new Ember.RSVP.Promise(function(resolve, reject) {
	  	Ember.$.ajax({
	  		url: "http://prod-drunkedguru.rhcloud.com/rest/users/me",
	  		method: "GET"
	  	}).then(function(response) {
	  		Ember.run(function() {
	  		    resolve({email: email, password: password});
	  		  });
	  	}, function(xhr, status, error) {
	  		console.log(xhr, status, error);
	  	});
	  });
	},

	invalidate(data) {
		//
	},

	generateDigest(login, password, requestMethod, authResponseHeader) {
		var responseObject = parseDigestValues(responseHeader);

		var qop = ("qop" in responseObject) ? (responseObject.qop === "auth,auth-int" || responseObject.qop === "auth-int,auth") ?
		        "auth-int" : responseObject.qop : "default";
	},

	parseDigestValues(authHeader) {
		var obj = {};
		var digestString = authHeader;
		var digestArray = [];
		var i;

		// First, remove "Digest " from the begining of the string.
		digestArray = digestString.split(" ");
		digestArray.shift();

		// Join the remaining elements back together.
		digestString = digestArray.join(" ");

		// Next, split on ", " to get strings of key="value" pairs.
		digestArray = digestString.split(/,\s+/);

		// Finally, we break each item in the array on "="
		for (i = 0; i < digestArray.length; i++) {
		    var item = digestArray[i].split("=");
		    item[1] = item[1].replace(/"/g, '');
		    obj[item[0]] = item[1];
		}

		return obj;
	}
});