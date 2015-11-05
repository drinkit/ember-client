import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Base.extend({
    digests: {},

	restore(data) {
	  //
	},

	authenticate(email, password) {
      var self = this;
	  return new Ember.RSVP.Promise(function(resolve, reject) {
        var headers = {};
        if (self.get("digests")["GET"]) {
            headers[self.get("digests")["GET"].name] = self.get("digests")["GET"].value;
        }
	  	Ember.$.ajax({
	  		url: "http://prod-drunkedguru.rhcloud.com/rest/users/me",
	  		method: "GET",
            headers: headers
	  	}).then(function(response) {
	  		Ember.run(function() {
	  		    resolve({email: email, password: password, digests: self.digests});
	  		  });
	  	}, function(xhr, status, error) {
            console.log(xhr);
	  		if (xhr.status === 401) {
                if (self.get("digests")["GET"]) {
                    Ember.run(function() {
                        self.set("digests", {});
                        reject("Invalid email or password");
                    });
                } else {
                    Ember.run(function() {
                        var digestHeader = self.generateDigest(email, password, "GET", xhr.getResponseHeader("WWW-Authenticate"));
                        self.get("digests")["GET"] = digestHeader;
                        self.authenticate(email, password);
                    });
                }

            }
	  	});
	  });
	},

	invalidate(data) {
		//
	},

	generateDigest(login, password, requestMethod, authResponseHeader) {
		var responseObject = this.parseDigestValues(authResponseHeader);

		var qop = ("qop" in responseObject) ? (responseObject.qop === "auth,auth-int" || responseObject.qop === "auth-int,auth") ?
		        "auth-int" : responseObject.qop : "default";
                
        // Nonce Count - incremented by the client.
        var nc = "00000001";

        // Generate a client nonce value for auth-int protection.
        var cnonce = CryptoJS.MD5(Math.random().toString()).toString();
        
        var uri = "";
        var digest = {
            "name": "Authorization",
            "value": "Digest " + "username=\"" + login /* Username we are using to gain access. */ + 
            "\", " + "realm=\"" + responseObject.realm /* Same value we got from the server.    */ + 
            "\", " + "nonce=\"" + responseObject.nonce /* Same value we got from the server.    */ + 
            "\", " + "uri=\"" + uri /* URI that we are attempting to access. */ + "\", " + 
            "qop=" + qop /* QOP as decided upon above.            */ + 
            ", " + "nc=" + nc /* Nonce Count as decided upon above.    */ + ", " + 
            "cnonce=\"" + cnonce /* Client generated nonce value.         */ + "\", " + 
            "response=\"" + this.generateResponse(login, password, requestMethod, responseObject, qop, nc, cnonce, uri) +  /* Generate a hashed response based on HTTP Digest specifications. */ 
            "\", " + "opaque=\"" + responseObject.opaque /* Same value we got from the server.    */ + "\""
        };
        
        return digest;
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
	},
    
    generateResponse(login, password, requestMethod, responseObject, qop, nc, cnonce, uri) {
        var hash;
        var HA1;
        var HA2;
        
        HA1 = CryptoJS.MD5(login + ":" + responseObject.realm + ":" + password).toString();
        HA2 = CryptoJS.MD5(requestMethod + ":" + uri).toString();
        hash = CryptoJS.MD5(HA1 + ":" + responseObject.nonce + ":" + nc + ":" + cnonce + ":" + qop + ":" + HA2).toString();
        return hash;
    }
});