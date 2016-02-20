var Botkit = require('botkit');
var path = require('path');
var process = require('process');

var token = require('./token');
var game21 = require('./game.21');
var Server = require('./server');
var BotHelpers = require('./bothelpers');
var UserData = require('./userdata');
var Storage = require('./storage');

var port = process.env.PORT ? process.env.PORT : 8080;

var storage = new Storage('userData.json');

Server.run(port, storage);

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

controller.hears('^22', ['direct_mention','mention'], function(bot, message) {
    game21.newGame(bot, message, storage);
});

controller.hears('^money', ['direct_mention', 'mention'], function(bot, message) {
    BotHelpers.getUserFromBot(bot, message).then(getUserMoney);

    function getUserMoney(user) {
        var data = new UserData(user.name, storage);
        bot.reply(message, user.name + ', you have: $' + data.getMoney());
    }
});

controller.hears('^help', ['direct_mention', 'mention'], function(bot, message) {
    bot.reply(message, 'You can say: "21" to play, or "money" to see your bank.');
});
