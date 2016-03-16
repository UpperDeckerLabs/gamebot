var gamebot = {
    start: start,
    restart: restart,
    getError: getError
};

var Botkit = require('botkit');

var game21 = require('./blackjack/game.21');
var Poker =  require('./poker');

var token =      require('./token');
var BotHelpers = require('./bothelpers');
var UserData =   require('./userdata');

var pjson = require('../package.json');

var _storage;
var _controller;
var _error;
var _bot;

function start(storage) {
    _storage = storage;

    _controller = Botkit.slackbot({
        logLevel: 1
    });

    _bot =  _controller
        .spawn({
            token: token
        })
        .startRTM(function(err) {
            if (err) {
                _error = err;
            }
        });

    setupListen(_controller);
}

function restart() {
    if (_storage && _controller && _bot) {
        _bot.closeRTM();
        start(_storage);
    }
}

function getError() {
    return _error;
}

function setupListen(controller) {
    controller.hears('^21', ['direct_mention','mention'], play21);
    controller.hears('^poker rules', ['direct_mention','mention'], pokerRules);
    controller.hears('^poker', ['direct_mention','mention'], playPoker);
    controller.hears('^money', ['direct_mention', 'mention'], showMoney);
    controller.hears('^help', ['direct_mention', 'mention'], showHelp);
    controller.hears('^version', ['direct_mention', 'mention'], showVersion);


    function play21(bot, message) {
        game21.newGame(bot, message, _storage);
    }

    function pokerRules(bot, message) {
        Poker.rules(bot, message);
    }

    function playPoker(bot, message) {
        Poker.newGame(bot, message, _storage);
    }

    function showMoney(bot, message) {
        BotHelpers.getUserFromBot(bot, message).then(getUserMoney);

        function getUserMoney(user) {
            var data = new UserData(user.name, _storage);
            bot.reply(message, user.name + ', you have: $' + data.getMoney());
        }
    }

    function showHelp(bot, message) {
        bot.reply(message, 'You can say: "21" to play blackjack, "poker" to play poker, or "money" to see your bank.');
    }

    function showVersion(bot, message) {
        bot.reply(message, 'Current version: ' + pjson.version);
    }
}


module.exports = gamebot;