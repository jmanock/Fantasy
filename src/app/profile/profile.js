// 'use strict';
// angular.module('fantasy')
// .controller('SearchCtrl', function(FirebaseUrl, $scope, $firebaseArray, $firebaseObject, $stateParams, Auth){
//
// var self = this;
// // Setup `CurrentUser`
// this.currentUser = $firebaseArray(FirebaseUrl.child('users').child($stateParams.id));
// Auth.onAuth(function(user){
//   self.user = user;
// });
//
//
// // Load `Team`
// this.currentUser.$loaded(function(){
//   self.teams = $firebaseObject(FirebaseUrl.child('userTeam').child($stateParams.id).child('team'));
//   var value = $firebaseObject(FirebaseUrl.child('userTeam').child($stateParams.id).child('count'));
//   value.$loaded(function(data){
//     var show = data.$value;
//     if(show === null){
//       $scope.hide = true;
//     }
//   });
// });
//
// // Load `LeaderBoard`
// this.players = $firebaseArray(FirebaseUrl.child('leaderboard'));
//
//
// // Add the `Player` to the `Team`
// this.add = function(p){
//   $scope.hide=false;
//   this.count(p);
// };
//
// this.count = function(p){
//   // Set-up a `Counter` to limit `Players` added
//   FirebaseUrl.child('userTeam').child(self.user.uid).child('count')
//   .transaction(function(count){
//     if(count === null){
//       count = 0;
//       $scope.hide = true;
//     }
//     if(count >= 5){
//       // Change to an alert or something
//       console.log('That is all the players you can have!');
//     }else{
//       $scope.hide = false;
//       return(count || 0)+1;
//     }
//   },function(err, committed, ss){
//     if(err){
//       console.log(err);
//     }else if(committed){
//       var id = ss.val()-1;
//       console.log(id);
//       var userTeam = FirebaseUrl.child('userTeam').child(self.user.uid).child('team').child(p.$id);
//
//       userTeam.update({
//         name: p.Name
//       });
//     }
//   });
// };
//
// // Remove a `Player` from `Team`
// this.removePlayer = function(id){
//   this.remove(id);
// };
//
// this.remove = function(id){
//   FirebaseUrl.child('userTeam').child(self.user.uid).child('count')
//   .transaction(function(id){
//     return(id || 0)-1;
//   }, function(err, committed, ss){
//     if(err){
//       console.log(err);
//     }else if(committed){
//       var i = ss.val();
//       var userTeam = FirebaseUrl.child('userTeam').child(self.user.uid).child('team').child(id);
//
//       userTeam.remove();
//       if(i === 0){
//         $scope.hide = true;
//       }
//     }
//   });
// };
//
// // Save the `Team` to call in the `Standings` page
// this.save = function(){
//   // need to change this var name
//   var something = FirebaseUrl.child('teams').child(self.user.fullName).child('team');
//   something.remove();
//   angular.forEach(self.teams, function(s){
//     something.push({
//       player: s.name
//     });
//   });
// };
//
// // Reset the `Team` back to Empty
// this.reset = function(){
//   var something = FirebaseUrl.child('teams').child(self.user.fullName);
//   var userTeam = FirebaseUrl.child('userTeam').child(self.user.uid);
//   $scope.hide = true;
//   userTeam.remove();
//   something.remove();
// };
//
// });// END CONTROLLER
'use strict';
angular.module('fantasy')
.controller('SearchCtrl', function($http, $scope, $q){

  var ref = new Firebase('https://fireseedangular.firebaseio.com/Players');
var players = [];
$http.get('app/profile/fedexStandings.json')
.success(function(x){

  var sux = x.tours;
  angular.forEach(sux, function(x){
    var rsux = x.years;
    angular.forEach(rsux, function(x){
      var vrsux = x.stats;
      angular.forEach(vrsux, function(x){
        var verysux = x.details;
        angular.forEach(verysux, function(x){
          var firstName = x.plrName.first;
          var lastName = x.plrName.last;
          var fullName = firstName + ' ' + lastName;
          players.push(fullName);
          return players;
        });
      });

    });
  });
}); // End `Fedex`

  // Get `Numbers` for all the players
  $http.get('app/profile/log0.json')
  .success(function(nums){
    var playersNumbers = nums.Tournament.Players;
    // $scope.players = [];
    // for(var i = 0; i<playersNumbers.length; i++){
    //   $scope.players.push(i);
    // }
    $scope.players = playersNumbers;
    for(var i = 0; i<playersNumbers.length; i++){
      for(var j = 0; j<players.length; j++){
        if(playersNumbers[i] === players[j]){
          console.log('we might have something to work with here');
        }
      }
    }
  }); // End of `Players` call
  var rOne = $http.get('app/profile/leaders.json');
  var rTwo = $http.get('app/profile/r2final.json');

  $q.all([rOne, rTwo]).then(function(result){
    var tmp = [];
    angular.forEach(result, function(response){
      tmp.push(response.data);
    });
    return tmp;
  }).then(function(tmpResult){
    var players = [];
    var roundOne = [];
    var roundTwo = [];
    angular.forEach(tmpResult, function(x){
      var plays = x.leaderboard.players;
      angular.forEach(plays, function(y){
        players.push(y);
      });
    });
    angular.forEach(players, function(t){
      var firstName = t.player_bio.first_name;
      var lastName = t.player_bio.last_name;
      var fullName = firstName + ' ' + lastName;
      var holes = t.holes;
      var points = 0;
      var round = t.current_round;

      angular.forEach(holes, function(z){
        var strokes = z.strokes;
        var par = z.par;
        var score = par - strokes;

        if(strokes === null){
          score = 0;
        }else{
          if(score === 0){
            points = points;
          }else if(score === 1){
            points = points + 1;
          }else if(score >= 2){
            points = points + 4;
          }else if(score === -1){
            points = points -1;
          }else if(score >= -2){
            points = points -2;
          }
        }
      }); // End `Holes` forEach
      if(round === 1){
        roundOne.push({
          Name:fullName,
          Points:points
        });
      }else{
        roundTwo.push({
          Name:fullName,
          Points:points
        });
      }

    }); // End `Players` forEach
    var knew = [];
    for(var i = 0; i<roundOne.length; i++){
      for(var j = 0; j<roundTwo.length; j++){
        if(roundOne[i].Name === roundTwo[j].Name){
          /* What's next???
            ~ have to work on round three and four
          */
          knew.push({
            Name:roundOne[i].Name,
            RoundOnePoints:roundOne[i].Points,
            RoundTwoPoints:roundTwo[j].Points,
            Total:roundOne[i].Points + roundTwo[j].Points
          });
        }
      }
    }
    ref.set(knew);
    $scope.scores = knew;
  }); // End `then function

var teamA = [];
var teamB = [];
var teamC = [];


$scope.add = function(t){
  // Get rid of the hard code numbers
  console.log(t.length);
  // if(t <= 26){
  //   if(teamA.length <= 1){
  //     teamA.push(t);
  //     this.isDisabledA = true;
  //
  //   }else{
  //     $scope.isDisabledA = true;
  //     console.log('To Many A players!!!');
  //   }
  // }else if(t <= 52){
  //   if(teamB.length <= 1){
  //     teamB.push(t);
  //     this.isDisabledB = true;
  //   }else{
  //     $scope.isDisabledB = true;
  //     console.log('To Many B players!!!');
  //   }
  // }else{
  //   if(teamC < 1){
  //     teamC.push(t);
  //     this.isDisabledC = true;
  //   }else{
  //     $scope.isDisabledC = true;
  //     console.log('You have a C player!');
  //   }
  // }
  // $scope.teamA = teamA;
  // $scope.teamB = teamB;
  // $scope.teamC = teamC;

}; // End `Add` Function

$scope.remove = function(t){
  if(t <= 26){
    var index = $scope.teamA.indexOf(t);
    $scope.teamA.splice(index,1);

  }else if(t <= 52){
    var ind = $scope.teamB.indexOf(t);
    $scope.teamB.splice(ind,1);

  }else{
    var ex = $scope.teamC.indexOf(t);
    $scope.teamC.splice(ex,1);
  }

}; // End `Remove` Function


})// End controller
.filter('firstName', function(){
  return function(x){
    var parts = x.PlayerName.split(',');
    var first = parts[1]+ ' '+parts[0];
    return first;
  };

})
.filter('secondName', function(){
  return function(x){
    var parts = x.split(',');
    var second = parts[1]+ ' '+ parts[0];
    return second;
  };
});
