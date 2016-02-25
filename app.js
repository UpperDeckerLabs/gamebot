var Botkit = require('botkit');
var path = require('path');
var process = require('process');

var token = require('./app/token');
var game21 = require('./app/blackjack/game.21');
var Poker = require('./app/poker');
var Server = require('./app/server');
var BotHelpers = require('./app/bothelpers');
var UserData = require('./app/userdata');
var Storage = require('./app/storage');

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

controller.hears('^21', ['direct_mention','mention'], function(bot, message) {
    game21.newGame(bot, message, storage);
});

controller.hears('^poker rules', ['direct_mention','mention'], function(bot, message) {
    Poker.rules(bot, message);
});

controller.hears('^poker', ['direct_mention','mention'], function(bot, message) {
    Poker.newGame(bot, message, storage);
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
