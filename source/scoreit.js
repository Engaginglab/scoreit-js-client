/**
	Javascript client library for the Score.it api
*/
scoreit = {
	domain: "http://127.0.0.1:8000/",
	version: "v1",
	user: {},
	//* @protected
	buildResourceUrl: function(resource, id) {
		var url = scoreit.domain + "api/" + scoreit.version + "/" + resource + "/";

		if (id !== undefined && id !== null) {
			if (id.length) {
				url += "set/" + id.join(";");
			} else {
				url += id;
			}
		}

		return url;
	},
	/**
		Makes an Ajax request. The default implementation uses the enyo framework.
		Overwrite this method to use a custom implementation.
	*/
	request: function(url, method, params, success, failure) {
		failure = function(sender, response) {
			document.write(sender.xhr.responseText);
		};

		var ajax = new enyo.Ajax({url: url, method: method, cacheBust: false, contentType: "application/json"});
		ajax.response(success);
		ajax.error(failure);
		ajax.go(params);
	},
	/**
		Generic function for requestion resources
	*/
	requestResource: function(resource, id, method, params, callback, failure) {
		var url = scoreit.buildResourceUrl(resource, id);

		params = params || {};
		if (scoreit.user.api_key) {
			// params["username"] = scoreit.user.username;
			// params["api_key"] = scoreit.user.api_key;
			url += "?username=" + scoreit.user.username + "&api_key=" + scoreit.user.api_key;
		}

		if (method != "GET") {
			params = JSON.stringify(params);
		}
		scoreit.request(url, method, params, callback, failure);
	},
	/**
		Validate user credentials and obtain api key and profile data
	*/
	setUser: function(username, password, callback) {
		scoreit.request(scoreit.domain + "api/" + scoreit.version + "/auth/validate/", "POST", {username: username, password: password}, function(sender, response) {
			scoreit.user = response;
			scoreit.user.username = username;
			callback(true);
		}, function(sender, response) {
			callback(false);
		});
	},
	signUp: function(username, password, email, firstName, lastName, gender, passNumber, address, city, zipCode, mobileNumber, profile, callback) {
		scoreit.request(scoreit.domain + "api/" + scoreit.version + "/auth/signup/", "POST", {
			username: username, password:password, email: email, first_name: firstName, last_name: lastName, gender: gender,
			pass_number: passNumber, address: address, city: city, zip_code: zipCode, mobile_number: mobileNumber, profile: profile
		}, callback);
	},
	isUnique: function(username, email, passNumber, callback) {
		passNumber = passNumber || 0;
		scoreit.request(scoreit.domain + "api/" + scoreit.version + "/auth/unique/", "GET", {user_name: username, email: email, pass_number: passNumber}, callback);
	}
};

/*
	Helper function for prototype inheritance
*/
Function.prototype.inheritsFrom = function(parentClass){
	this.prototype = new parentClass();
	this.prototype.constructor = this;
	this.prototype.parent = parentClass.prototype;
	return this;
};

/**
	Base resource class that implements basic REST functionality
*/
scoreit.Resource = function() {};
scoreit.Resource.prototype = {
	list: function(filters, callback) {
		var params = {};
		if (filters) {
			for (var i = 0; i < filters.length; i++) {
				var field = filters[i][0];
				if (filters[i][2]) {
					field += "__" + filters[i][2];
				}
				params[field] = filters[i][1];
			}
		}
		scoreit.requestResource(this.resourceName, null, "GET", params, callback);
	},
	detail: function(id, callback) {
		scoreit.requestResource(this.resourceName, id, "GET", null, callback);
	},
	create: function(params, callback) {
		scoreit.requestResource(this.resourceName, null, "POST", params, callback);
	},
	update: function(id, params, callback) {
		scoreit.requestResource(this.resourceName, id, "PATCH", params, callback);
	},
	remove: function(id, callback) {
		scoreit.requestResource(this.resourceName, id, "DELETE", null, callback);
	}
};


scoreit.Union = function() {
	this.resourceName = "union";
};

scoreit.Union.inheritsFrom(scoreit.Resource);

scoreit.Union.prototype.create = function(name, callback) {
	this.parent.create.call(this, {name: name}, callback);
};


scoreit.League = function() {
	this.resourceName = "league";
};

scoreit.League.inheritsFrom(scoreit.Resource);

scoreit.League.prototype.create = function(name, gender, callback) {
	this.parent.create.call(this, {name: name, gender: gender}, callback);
};


scoreit.Club = function() {
	this.resourceName = "club";
};

scoreit.Club.inheritsFrom(scoreit.Resource);

scoreit.Club.prototype.create = function(name, union, callback) {
	this.parent.create.call(this, {name: name, union: union}, callback);
};


scoreit.Team = function() {
	this.resourceName = "team";
};

scoreit.Team.inheritsFrom(scoreit.Resource);

scoreit.Team.prototype.create = function(name, club, league, callback) {
	this.parent.create.call(this, {name: name, club: league}, callback);
};


scoreit.Person = function() {
	this.resourceName = "person";
};

scoreit.Person.inheritsFrom(scoreit.Resource);

scoreit.Person.prototype.create = function(firstName, lastName, passNumber, gender, address, city, zipCode, birthday, callback) {
	this.parent.create.call(this, {first_name: firstName, last_name: lastName,
		pass_number: passNumber, gender: gender, address: address, city: city, zip_code: zipCode, birthday: birthday}, callback);
};


scoreit.GameType = function() {
	this.resourceName = "gametype";
};

scoreit.GameType.inheritsFrom(scoreit.Resource);

scoreit.GameType.prototype.create = function(name, callback) {
	this.parent.create.call(this, {name: name}, callback);
};

scoreit.union = new scoreit.Union();
scoreit.league = new scoreit.League();
scoreit.club = new scoreit.Club();
scoreit.team = new scoreit.Team();
scoreit.person = new scoreit.Person();
scoreit.gameType = new scoreit.GameType();