'use strict';
angular.module('fantasy')
// Adds all the points together
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
// Loads the Leaderboard and teams
.controller('StandingsCtrl', function($scope, FirebaseUrl, $firebaseObject, $firebaseArray){
	var self = this;

	// Gets the leaderboard and points
	var ref = new Firebase('https://toga.firebaseio.com');
	this.players = $firebaseArray(ref);

	// Hides the players from the team
	$scope.toggle = false;

	// Gets the teams
	this.teams = $firebaseArray(FirebaseUrl.child('teamUser'));
	FirebaseUrl.child('teamUser').on('value', function(team){
		team.forEach(function(mine){
			//console.log(mine.val().name);
		});
	});
	
});
/* Work on loading points by matching names with names to get the points'
	* also find out why there is still an error but points still work.
*/


