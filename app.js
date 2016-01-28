var token = require('./token');
var Botkit = require('botkit');
var game21 = require('./game.21');

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
