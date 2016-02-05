var Botkit = require('botkit');
var path = require('path');
var process = require('process');

var token = require('./token');
var game21 = require('./game.21');
var Server = require('./server');

var port = process.env.PORT ? process.env.PORT : 8080;

var folder = path.join(__dirname, 'static');

Server.run(port, folder);

var controller = Botkit.slackbot({
    logLevel: 1
});

controller.spawn({
    token: token
}).startRTM(function(err) {
    if (err) {
        throw new Error(err);
    }
});

controller.hears('^21', ['direct_mention','mention'], function(bot, message) {
    game21.newGame(bot, message);
});
