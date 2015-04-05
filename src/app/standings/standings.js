'use strict';
angular.module('fantasy')
.controller('StandingsCtrl', function(FirebaseUrl, $scope, $firebaseObject){
 var ref = new Firebase('https://toga.firebaseio.com/');
 this.players = $firebaseObject(ref);

 var fb = new Firebase('https://reditclone.firebaseio.com/Team');

this.addPlayer = function(player){
  this.incId(player);
  //console.log(player.Name);
};
this.incId = function(player){
fb.child('counter').transaction(function(id){
  return(id||0)+1;
}, function(err, committed, ss){
  if(err){
    console.log(err);
  }else if(committed){
    var id = ss.val();
    fb.child('Players').child('player'+id).set(player.Name);

  }
});
};

});