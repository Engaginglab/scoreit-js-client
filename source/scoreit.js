scoreit = {
	domain: "http://127.0.0.1:8000/",
	version: "v1",
	user: {
		username: "admin",
		password: "admin"
	},
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
	/*
		Builds an Ajax request. The default implementation uses the enyo framework.
		Overwrite this method to use a custom implementation.
	*/
	request: function(url, method, params, callback) {
		username = scoreit.user.username;
		password = scoreit.user.password;
		var ajax = new enyo.Ajax({url: url, method: method, cacheBust: false, contentType: "application/json", username: username, password: password});
		ajax.response(callback);
		ajax.go(params);
	},
	requestResource: function(resource, id, method, params, callback) {
		var url = scoreit.buildResourceUrl(resource, id);
		console.log(url);
		scoreit.request(url, method, params, callback);
	}
};

scoreit.union = {
	getList: function(filters, callback) {
		var params = {};
		for (var i = 0; i < filters.length; i++) {
			var field = filters[i][0];
			if (filters[i][2]) {
				field += "__" + filters[i][2];
			}
			params[field] = filters[i][1];
		}
		scoreit.requestResource("union", null, "GET", params, callback);
	},
	getDetail: function(id, callback) {
		scoreit.requestResource("union", id, "GET", null, callback);
	},
	create: function(name, callback) {
		scoreit.requestResource("union", null, "POST", {name: name}, callback);
	},
	update: function(id, params, callback) {
		scoreit.requestResource("union", id, "PATCH", params, callback);
	},
	remove: function(id, callback) {
		scoreit.requestResource("union", id, "DELETE", null, callback);
	}
};