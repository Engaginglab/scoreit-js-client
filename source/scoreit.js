/**
	Javascript client library for the Score.it api
*/
scoreit = {
	domain: "http://127.0.0.1:8000/",
	version: "v1",
	user: {},
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
	requestResource: function(url, method, params, callback, failure) {
		//var url = scoreit.buildResourceUrl(resource, id);

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
	login: function(username, password, callback) {
		scoreit.request(scoreit.domain + "auth/api/" + scoreit.version + "/validate/", "POST", {username: username, password: password}, function(sender, response) {
			scoreit.user = response;
			callback(true);
		}, function(sender, response) {
			callback(false);
		});
	},
	signUp: function(params, success, fail) {
		scoreit.request(scoreit.domain + "auth/api/" + scoreit.version + "/signup/", "POST", params, success, fail);
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
	//* @protected
	buildUrl: function(id) {
		var url = scoreit.domain + this.appPrefix + "api/" + scoreit.version + "/" + this.resourceName + "/";

		if (id !== undefined && id !== null) {
			if (typeof(id) != "string" && id.length) {
				url += "set/" + id.join(";");
			} else {
				url += id;
			}
		}

		return url;
	},
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
		scoreit.requestResource(this.buildUrl(), "GET", params, callback);
	},
	detail: function(id, callback) {
		scoreit.requestResource(this.buildUrl(id), "GET", null, callback);
	},
	create: function(params, callback) {
		scoreit.requestResource(this.buildUrl(), "POST", params, callback);
	},
	update: function(id, params, callback) {
		scoreit.requestResource(this.buildUrl(id), "PATCH", params, callback);
	},
	put: function(id, params, callback) {
		scoreit.requestResource(this.buildUrl(id), "PUT", params, callback);
	},
	remove: function(id, callback) {
		scoreit.requestResource(this.buildUrl(id), "DELETE", null, callback);
	}
};

/*
	Authentication Resources
*/

scoreit.auth = {};

scoreit.auth.User = function() {
	this.resourceName = "user";
	this.appPrefix = "auth/";
};

scoreit.auth.User.inheritsFrom(scoreit.Resource);

scoreit.auth.User.prototype.isUnique = function(params, callback) {
	scoreit.request(scoreit.domain + this.appPrefix + "api/" + scoreit.version + "/unique/", "GET", params, callback);
};

scoreit.auth.Profile = function() {
	this.resourceName = "profile";
	this.appPrefix = "auth/";
};

scoreit.auth.Profile.inheritsFrom(scoreit.Resource);

scoreit.auth.user = new scoreit.auth.User();
scoreit.auth.profile = new scoreit.auth.Profile();

/*
	Handball Resources
*/

scoreit.handball = {};

scoreit.handball.Union = function() {
	this.resourceName = "union";
	this.appPrefix = "handball/";
};

scoreit.handball.Union.inheritsFrom(scoreit.Resource);

// scoreit.handballUnion.prototype.create = function(name, callback) {
// 	this.parent.create.call(this, {name: name}, callback);
// };


scoreit.handball.District = function() {
	this.resourceName = "district";
	this.appPrefix = "handball/";
};

scoreit.handball.District.inheritsFrom(scoreit.Resource);

// scoreit.handballLeague.prototype.create = function(name, gender, callback) {
// 	this.parent.create.call(this, {name: name, gender: gender}, callback);
// };


scoreit.handball.League = function() {
	this.resourceName = "league";
	this.appPrefix = "handball/";
};

scoreit.handball.League.inheritsFrom(scoreit.Resource);

// scoreit.handball.League.prototype.create = function(name, gender, callback) {
// 	this.parent.create.call(this, {name: name, gender: gender}, callback);
// };


scoreit.handball.Club = function() {
	this.resourceName = "club";
	this.appPrefix = "handball/";
};

scoreit.handball.Club.inheritsFrom(scoreit.Resource);

// scoreit.handball.Club.prototype.create = function(name, union, callback) {
// 	this.parent.create.call(this, {name: name, union: union}, callback);
// };


scoreit.handball.Team = function() {
	this.resourceName = "team";
	this.appPrefix = "handball/";
};

scoreit.handball.Team.inheritsFrom(scoreit.Resource);

// scoreit.handball.Team.prototype.create = function(name, club, league, callback) {
// 	this.parent.create.call(this, {name: name, club: league}, callback);
// };


scoreit.handball.Person = function() {
	this.resourceName = "person";
	this.appPrefix = "handball/";
};

scoreit.handball.Person.inheritsFrom(scoreit.Resource);

scoreit.handball.Person.prototype.isUnique =  function(params, callback) {
	scoreit.request(scoreit.domain + this.appPrefix + "api/" + scoreit.version + "/unique/", "GET", params, callback);
};

// scoreit.handball.Person.prototype.create = function(firstName, lastName, passNumber, gender, address, city, zipCode, birthday, callback) {
// 	this.parent.create.call(this, {first_name: firstName, last_name: lastName,
// 		pass_number: passNumber, gender: gender, address: address, city: city, zip_code: zipCode, birthday: birthday}, callback);
// };


scoreit.handball.GameType = function() {
	this.resourceName = "gametype";
	this.appPrefix = "handball/";
};

scoreit.handball.GameType.inheritsFrom(scoreit.Resource);

// scoreit.handball.GameType.prototype.create = function(name, callback) {
// 	this.parent.create.call(this, {name: name}, callback);
// };

scoreit.handball.union = new scoreit.handball.Union();
scoreit.handball.district = new scoreit.handball.District();
scoreit.handball.league = new scoreit.handball.League();
scoreit.handball.club = new scoreit.handball.Club();
scoreit.handball.team = new scoreit.handball.Team();
scoreit.handball.person = new scoreit.handball.Person();
scoreit.handball.gameType = new scoreit.handball.GameType();