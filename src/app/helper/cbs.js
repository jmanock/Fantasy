'use strict';
var cheerio = require('cheerio');
var request = require('request');
var url = 'https://sports.yahoo.com/golf/pga/leaderboard';
var count = 0;

// Requesting the yahoo leaderboard page
request(url, function(error, response, body){
  // If no errors and status code is a go
  if(!error && response.statusCode === 200){
    // Load cheerio
    var $ = cheerio.load(body);
    var links = $('.player > a');

    // Find all `links` with a class of player and a child of `a`
    links.each(function(i, link){
      var urls = $(link).attr('href');
      var pages = ('https://sports.yahoo.com'+urls);

      // Search all `pages` from `links`
      request(pages, function(error, response, body){
        if(!error && response.statusCode ===  200){
          var $playersPage = cheerio.load(body);
          var name = $playersPage('h1').text();
          var eagle = $playersPage('.eagle').text();
          var birdie = $playersPage('.birdie').text();
          var bogie = $playersPage('.bogey').text();
          var double = $playersPage('.dblbogey').text();
          var points = eagle.length * 3 + birdie.length * 1 + bogie.length * -1 + double.length * -2;
          var data ={
            Name: name,
            Points: points
          };

          // Set up a counter for pages that don't load
          if(data.Name === ''){
            console.log(pages);
             count++;
          }
          //console.log(data.Name);
        }
        console.log(i + ' ' + count);
      });
    });
  }
});
