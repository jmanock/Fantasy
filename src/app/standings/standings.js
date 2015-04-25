'use strict';
angular.module('fantasy')
.filter('sumOfValue', function(){
	return function(data, key){
		if(typeof(data)=== 'undefined' && typeof(key)=== 'undefined'){
			return 0;
		}
		var sum = 0;
		for(var i = 0; i< data.length; i++){
			sum = sum + data[i][key];
		}
		return sum;
	}
})
.controller('StandingsCtrl', function($scope, FirebaseUrl, $firebaseObject, $firebaseArray){
	var self = this;

	// Gets the leaderboard and points
	var ref = new Firebase('https://toga.firebaseio.com');
	this.players = $firebaseArray(ref);

	// Hides the players from the team
	$scope.toggle = false;

	// Gets the teams
	this.teams = $firebaseArray(FirebaseUrl.child('teamUser'));
});



