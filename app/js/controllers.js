'use strict';

/* Controllers */

app.controller('homeCtrl', [ '$scope', 'Session', 'Users',
		function($scope, Session, Users) {
			$scope.message = "";
			$scope.session = Session;
		} ]);

app.controller('profileCtrl', [ '$scope', 'Session', 'Users',
		function($scope, Session, Users) {
			$scope.message = "";
			$scope.session = Session;
			$scope.$watch(function() {
				return Session.isLoggedIn();
			}, function(nv, ov) {
				Waazdoh.debug("loggedin changed " + nv);

				if (nv) {
					Users.getProfile().success(function(profile) {
						$scope.profile = profile;
					});
				}
			});

			$scope.submit = function() {
				Users.saveProfile($scope.profile);
			}
		} ]);

app.controller('MessageCtrl', [ '$scope', 'Message', function($scope, Message) {
	$scope.messages = Message.query();
	$scope.orderProp = 'age';

	$scope.message = Message.get({
		id : 'new'
	});

	$scope.save = function() {
		$scope.message = "Submitting";

		var nmessage = new Message();

		nmessage.title = $scope.message.title;
		nmessage.content = $scope.message.content;

		$scope.message = "saving message " + nmessage.title;

		nmessage.$save();
	};

} ]);

app.controller('MessageListCtrl', [ '$scope', 'Message',
		function($scope, Message) {
			$scope.messages = Message.query();
			$scope.orderProp = 'age';
		} ]);

app.controller('MessageDetailCtrl', [ '$scope', '$routeParams', 'Message',
		function($scope, $routeParams, Message) {
			$scope.message = Message.get({
				messageId : $routeParams.messageId
			}, function(message) {
				$scope.mainImageUrl = message.images[0];
			});

			$scope.setImage = function(imageUrl) {
				$scope.mainImageUrl = imageUrl;
			};
		} ]);

app.controller('NavbarCtrl', [ '$scope', '$timeout', 'Session', '$location', '$uibModal', function($scope, $timeout, Session, $location, $uibModal) {
	$scope.session = Session;

	Waazdoh.debug("Location " + odump($location));	
	var path = "" + $location.path();
	if(path.indexOf("popup")>=0) {
		$scope.shownav = false;
	} else {
		$scope.shownav = true;
	}
	
	$scope.navbarinit = true;
	
	$scope.logout = function() {
		Session.reset();
	}
	
	$scope.loginOpen = function() {
		var uibModalInstance = $uibModal.open({
		  animation: true,
		  template: '<IFRAME id="loginiframe" SRC="/#/loginpopup" WIDTH="100%" HEIGHT="100%">iframe</iframe>',
		  controller: 'LoginModalCtrl',
    });
  };
} ]);

app.controller('LoginModalCtrl', [ '$scope', '$timeout', 'Session', '$uibModalInstance', function($scope, $timeout, Session, $uibModalInstance) {
	$scope.session = Session;
    $scope.$watch('session.isloggedin', function() {
		Waazdoh.debug("islogged in changed. refresh iframe");
		if(Session.isloggedin) {
			$('#loginiframe').attr('src', '/#/loggedin');
			Waazdoh.debug("Modal should be closed ");
			$uibModalInstance.close();
		} else {
			//$('#loginiframe').attr('src', '/#/loginpopup');
		}
	});

} ]);


app.controller('DebugCtrl', [ '$scope', '$timeout', 'Session', '$location', function($scope, $timeout, Session, $location) {
	$scope.session = Session;

	var path = "" + $location.path();
	if(path.indexOf("popup")>=0) {
		$scope.showdebug = false;
	} else {
		$scope.showdebug = true;
	}
} ]);

app.controller('apploginsCtrl', [ '$scope', '$stateParams', 'Users',
		function($scope, $stateParams, Users) {
			$scope.id = $stateParams.appid;
			Waazdoh.debug("stateparams " + odump($stateParams));

			$scope.accept = function() {
				Users.acceptApp($scope.id).success(function() {
					Waazdoh.debug("app accepted");
					$scope.message = "done";
					$scope.id = null;
				});
			}

			$scope.reject = function() {

			}
		} ]);

app.controller('loginCtrl', [ '$scope',  '$timeout', 'Session', 'Info', '$stateParams',
		function($scope, $timeout, Session, Info, $stateParams) {
			$scope.message = "TEST MESSAGE";
			$scope.user = {};
			$scope.session = Session;
			$scope.info = Info;
			$scope.setsession = $stateParams.sessionid;
			Info.authmessage = "TESTING";
			
			if($stateParams.sessionid) {
				Session.setSession($stateParams.sessionid);
			}
			
			if ($scope.isloggedin) {
				goToRoot();
			}			
		} ]);

app.controller('loginPopupCtrl', [ '$scope',  '$timeout', 'Session', 'Info', '$stateParams',
		function($scope, $timeout, Session, Info, $stateParams) {
			$scope.message = "TEST MESSAGE";
			$scope.user = {};
			$scope.session = Session;
			$scope.info = Info;
			$scope.setsession = $stateParams.sessionid;
			Info.authmessage = "TESTING";
			
			if($stateParams.sessionid) {
				Session.setSession($stateParams.sessionid);
			}
			
			if ($scope.isloggedin) {
				goToRoot();
			}			
		} ]);

// inject the OAuth into the controller
app.controller('GoogleController', [
		'$scope',
		'Session',
		'OAuthService',
		function($scope, Session, OAuthService) {
			var self = this;

			OAuthService.initialize();

			self.doLoginFunction = function(userinfo, result) {
				OAuthService.loginWithOauth("google", userinfo.id,
						userinfo.username, result.access_token).then(
						function() {
							// goToRoot();
						});
			};

			$scope.connectButton = function() {
				OAuth.popup('google', {
					cache : false
				}).done(function(result) {
					Waazdoh.debug("Oauth result " + odump(result));
					result.get('/oauth2/v1/userinfo').done(function(userinfo) {
						Waazdoh.debug("UserInfo " + odump(userinfo));
						self.doLoginFunction(userinfo, result);
					});
				}).fail(function(err) {
					Waazdoh.debug("ERROR " + err);
					Waazdoh.debug("ERROR " + odump(err));
					$scope.message = "ERROR " + err;
				});
			};
		} ]);

app.controller('FacebookController', [
		'$scope',
		'Session',
		'OAuthService',
		'Info',
		function($scope, Session, OAuthService, Info) {
			var self = this;
			
			OAuthService.initialize();

			self.doLoginFunction = function(userinfo, result) {
				OAuthService.loginWithOauth("facebook", userinfo.id,
						userinfo.username, result.access_token).then(
						function() {
							// goToRoot();
						});
			};

			$scope.connectButton = function() {				
				OAuth.popup('facebook', {
					cache : false
				}).done(function(result) {
					Waazdoh.debug("Oauth result " + odump(result));
					Info.autherror = "";
					
					result.get('/me').done(function(userinfo) {
						Waazdoh.debug("facebook data " + odump(userinfo));
						self.doLoginFunction(userinfo, result);
					}).fail(function(err) {
						Info.autherror = "Authentication error";
						Waazdoh.debug("ERROR oauth " + err);
						Waazdoh.debug("ERROR oauth info " + odump(Info));
						$scope.$apply();
					});

				}).fail(function(err) {
					Info.autherror = "ERROR " + err;
					Waazdoh.debug("ERROR oauth " + err);
					Waazdoh.debug("ERROR oauth " + odump(err));
				});
			};

		} ]);
