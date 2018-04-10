require("dotenv").config();
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var colors = require('colors');
var inquirer = require('inquirer');
// fs is a core Node package for reading and writing files
var fs = require("fs");
// passing the env. keys to js for API access/functionality
var keys = require('./keys.js');

// codes required to import the Spotify & Twitter keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//setting input variables
var command = process.argv[2];
var inputName = process.argv[3];

function liriInquirer() {
    inquirer.prompt(
        {
            type: "list",
            name: "command",
            message: "\n Hello I am Liri, which command would you like to run?",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
        },
    ).then(function (input) {
        if (input.command == "my-tweets") {
            myTweets();
        } else if (input.command == "spotify-this-song") {
            inquirer.prompt({
                type: "input",
                name: "inputName",
                message: "What song would you like to search?"

            }, ).then(function (input) {
                if (input.inputName == "") {
                    spotifyThisSong("The Sign, Ace of Base");
                } else {
                    spotifyThisSong(input.inputName);
                }
            })
        } else if (input.command == "movie-this") {
            inquirer.prompt({
                type: 'input',
                name: 'inputName',
                message: 'What movie are you searching for?'
            }, ).then(function (input) {
                if (input.inputName === "") {
                    movieThis("Mr. Nobody");
                } else {
                    movieThis(input.inputName);
                }
            })
        } else if (input.command == "do-what-it-says") {
            doWhatItSays();
        };
    });
}
function myTweets() {
    var params = {
        screen_name: 'Ryan',
        count: 20,
        tweet_mode: 'extended',
    };
    client.get('statuses/user_timeline/', params, function (error, tweets, response) {
        if (!error) {
            console.log("Tweets:");
            console.log("\n");
            for (i = 0; i < tweets.length; i++) {
                console.log("Date: " + tweets[i].created_at);
                console.log("Tweet: " + tweets[i].full_text);
                console.log("\n");
            };
        };
        liriInquirer();
    });
};

function spotifyThisSong(inputName) {
    spotify.search({
        type: 'track',
        query: inputName,
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log("Here you go:");
        console.log("\n");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Spotify link: " + data.tracks.items[0].external_urls.spotify);
        console.log("\n");
        liriInquirer();
    });
};

function movieThis(inputName) {
    request("http://www.omdbapi.com/?t=" + inputName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Here you go:");
            console.log("\n");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released on: " + JSON.parse(body).Released);
            console.log("Rated: " + JSON.parse(body).Rated);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Released in: " + JSON.parse(body).Country);
            console.log("Language(s): " + JSON.parse(body).Language);
            console.log("Plot summary: " + JSON.parse(body).Plot);
            console.log("Starring: " + JSON.parse(body).Actors);
            console.log("\n");
        };
        liriInquirer();
    });
}

function doWhatItSays() {
    fs.readFile("randomtext.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log("The file says:\n");
        console.log(data.inverse);
        console.log("\nAllow me to do that for you.\n     *  *  *  *  *");

        var dataArr = data.split(",");
        switchCase(dataArr[0], dataArr[1]);
        liriInquirer();
    });
    liriInquirer();

};
