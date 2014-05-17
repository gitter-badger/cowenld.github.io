'use strict';

angular.module('cowenldGithubApp')
	.controller('HomeCtrl', function ($scope) {
		$scope.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		$scope.init = function () {
			var today = new Date();
			console.log(today);
			alert(1);
		};
	});