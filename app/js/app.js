'use strict';

/* App Module */

var app = angular.module('waazdohApp',
		[ 'ui.router', 'ngResource', 'ngCookies', 'ui.bootstrap' ]);

app.config(function($stateProvider, $urlRouterProvider) {
	// Now set up the states
	$stateProvider.state('/', {
		url : "/",
		templateUrl : "partials/home.html"
	}).state('messages', {
		url : "/messages",
		templateUrl : "partials/messages.html"
	}).state('messages.list', {
		url : "/list",
		templateUrl : "partials/message-list.html"
	}).state('messages.edit', {
		url : "/messages/edit",
		templateUrl : "partials/message_edit_form.html"
	}).state('messages.edit.submit', {
		url : "/messages/edit/submit",
		templateUrl : "partials/message_submit.html",
		controller : function($scope, $state) {
			$scope.submit(function(message) {
				$state.go('message');
			});
		}
	}).state('profile', {
		url : "/profile",
		templateUrl : "partials/profile.html"
	}).state("/loginpopup", { 
		url : "/loginpopup",
		templateUrl : "partials/loginpopup.html"
	}).state('login', {
		url : "/login",
		templateUrl : "partials/loginpage.html"
	}).state('login.selectservice', {
		url : "/selectservice",
		templateUrl : "partials/login_selectservice.html"
	}).state('login.setsession', {
		url : "/setsession/:sessionid",
		templateUrl : "partials/login_setsession.html"
	}).state('login.registration', {
		url : "/registration",
		templateUrl : "partials/login_registration.html"
	}).state('login.registrationsubmit', {
		url : '/submit',
		templateUrl : 'partials/login_registrationsubmit.html',
		controller : function($scope) {
			$scope.login();
		}
	}).state("/applogins", {
		url : '/applogins/:appid',
		templateUrl : "partials/applogins.html"
	});

});

function isSessionId(ssession) {
	ssession = "" + ssession;
	// TODO other checks?
	return ssession.length > 15 && ssession.indexOf('-') > 0;
}

function goToRoot() {
	window.location = "/app";
}

function isID(str) {
	if (str === null) {
		return false;
	}
	if (str === "") {
		return false;
	}

	str = "" + str;
	if (str.indexOf("-") < 0) {
		return false;
	}

	if (str.length < 14) {
		return false;
	}

	return true;
}
