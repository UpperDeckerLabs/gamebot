var token = require('./token');
var Botkit = require('botkit');

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
