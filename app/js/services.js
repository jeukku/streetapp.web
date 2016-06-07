'use strict';

/* Services */

app.factory('Global', [ function() {
	return {
		session : {
			sessionid : "",
			prevcookie: "initial"
		}
	};
} ]);

app.factory('Message', [ '$resource', function($resource) {
	return $resource(serviceurl + 'messages/get/:messageId', {
		id : '@id'
	}, {
		query : {
			method : 'GET',
			isArray : true
		},
		save : {
			url : serviceurl + 'messages/save',
			method : 'POST'
		}
	});
} ]);

app.factory('Users', [
		'$resource',
		'$http',
		function($resource, $http) {
			var self = {
				oauthLogin : function(service, id, username, access_token) {
					return $http.post(serviceurl + "users/oauthlogin", JSON
							.stringify({
								"service" : service,
								"oauthid" : id,
								"username" : username,
								"accesstoken" : access_token
							}), {
						contentType : "application/json"
					});
				},

				checkSession : function() {
					return $http.get(serviceurl + "users/checksession");
				},

				acceptApp : function(appid) {
					return $http.get(serviceurl + "users/acceptapp/" + appid);
				},

				getProfile : function() {
					return $http.get(serviceurl + "users/getprofile");
				},

				saveProfile : function(profile) {
					return $http.post(serviceurl + "users/saveprofile", JSON
							.stringify(profile), {
						contentType : "application/json"
					});
				}
			};

			return self;
		} ]);

app.factory('Info', [ function() {
	var values = {
			authmessage : "AUTHMESSAGE",
			infomessage : "INFOMESSAGE"
	};
	return values;
} ]);

app.factory('Session', [ '$resource', '$cookieStore', '$timeout', 'Users',
		'Global', '$window', function($resource, $cookies, $timeout, Users, Global, $window) {
			var service = {
				isloggedin : false
			};

			Global.session = service;

			service.getSessionID = function() {
				return service.sessionid;
			};

			service.checkCookie = function() {
				var sid;
				try {
					sid = "" + $cookies.get('sessionid');
					// Removing characters that shouldn't be
					// there.
					sid = sid.replace("\"", "");
				} catch (e) {
					Waazdoh.debug("Exception " + e);
					sid = "";
				}
								
				if(service.prevcookie != "initial" && isID(sid) && sid!=service.prevcookie) {
					// cookie changed
					Waazdoh.debug("cookie changed! " + sid);
					//$window.location.reload();
				}

				service.prevcookie = sid;
				
				if (isID(sid)) {
					if(!isID(service.sessionid) || !service.isloggedin) {
						Waazdoh.debug("checkCookie " + sid + " setting sessionid");
						service.setSession(sid);
					}
				}
			};

			service.reset = function() {
				service.setSession("");
			}

			service.isLoggedIn = function() {
				return service.isloggedin;
			};

			service.getUsername = function() {
				return service.name;
			};

			service.set = function(login) {
				Waazdoh.debug("service set " + odump(login));
				
				if(login.data) {
					login = login.data;
					poop();
				}
				
				if (isID(login.userid) && isID(login.sessionid)) {
					service.sessionid = login.sessionid;
					service.name = login.username;
					service.userid = login.userid;

					$cookies.put('sessionid', "" + login.sessionid);
					service.isloggedin = true;
					return true;
				} else {
					Waazdoh.debug("removing session " + odump(login));
					$cookies.remove('sessionid');
					service.isloggedin = false;
					return false;
				}
			};

			service.setSession = function(nsessionid) {
				if (isID(nsessionid)) {
					service.sessionid = nsessionid;
					Waazdoh.debug("set sessionid " + service.sessionid);
					
					Users.checkSession().then(function(user) {
						Waazdoh.debug("checkSession " + odump(user));
						var login = user.data;
						login.sessionid = nsessionid;
						service.isloggedin = true;
						service.set(login);
					}, function(errorresp) {
						Waazdoh.debug("setSession error " + errorresp);
						service.reset();
					});
				} else {
					Waazdoh.debug("unknown sessionid " + nsessionid);
					
					$cookies.remove('sessionid');
					service.isloggedin = false;
					service.name = "unknown";
					service.userid = "";
				}
			};

			service.timeoutCheckCookie = function() {
				service.checkCookie();
				$timeout(function() {
					service.timeoutCheckCookie();
				}, 200);
			}
			
			$timeout(function() {
				service.timeoutCheckCookie();
			}, 100);

			return service;
		} ]);

var oauthservice = function($resource, $q, Users, Session) {
	var authorizationResult = false;

	var self = {
		initialize : function() {
			OAuth.initialize('lusGX30tjmjy6FgcIM9zc36V2AM', {
				cache : true
			});

			authorizationResult = OAuth.create('google');
		},
		isReady : function() {
			return (authorizationResult);
		},

		clearCache : function() {
			OAuth.clearCache('google');
			OAuth.clearCache('facebook');
			authorizationResult = false;
		},

		loginWithOauth : function(service, id, username, access_token) {
			var deferred = $q.defer();

			Waazdoh.debug("oauth loginwithoauth:" + access_token + " service:"
					+ service);
			var me = this;
			Users.oauthLogin(service, id, username, access_token).success(
					function(vo) {
						Waazdoh.debug("oauthlogin response " + odump(vo));
						if (Session.set(vo)) {
							deferred.resolve(vo);
						} else {
							deferred.reject(vo);
						}
					});

			return deferred.promise;
		},

	}

	return self;
}

app.factory('OAuthService', [ '$resource', '$q', 'Users', 'Session',
		oauthservice ]);

app.factory('httpRequestInterceptor', [ 'Global', function(Global) {
	return {
		request : function(config) {
			// use this to destroying other existing headers
			config.headers = {
				'Authentication-token' : (Global.session.sessionid?Global.session.sessionid:"no-auth"),
				'Content-Type' : 'application/json;charset=utf-8'
			}

			return config;
		}
	};
} ]);

app.config(function($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
});
