var Deck = require('./deck');
var Dealer = require('./dealer');
var Hand = require('./hand');

var game = {
    newGame: newGame
};

module.exports = game;

var _maxScore = 21;

function newGame(bot, message) {
    var user;
    bot.startConversation(message, dealHand);

    function dealHand(response, convo) {

        bot.api.users.info({user:message.user}, function(err, data) {
            user = data.user;

            var dealer = new Dealer();

            // Create a new 52 card poker deck
            var deck = new Deck();
            deck.shuffle();

            var hand = new Hand();

            hand.add(deck.draw());
            hand.add(deck.draw());

            dealer.addCard(deck.draw());

            var game = {
                dealer: dealer,
                deck:   deck,
                hand:   hand,
                user:   user,
                busted: false
            };

            takeTurn(game, response, convo);
            convo.next();

            console.log('Starting game with user: ' + user.name);
        });
    }
}

function hitCard(game, response, convo) {
    convo.say('hitting');
    game.hand.add(game.deck.draw());
    if (game.hand.value() > _maxScore) {
        busted(game, response, convo);
    }
    else {
        takeTurn(game, response, convo);
    }
    convo.next();
}

function stay(game, response, convo) {
    convo.say('staying');
    endGame(game, response, convo);
    convo.next();
}

function busted(game, response, convo) {
    convo.say(game.user.name + ', your hand: ' + game.hand.print());
    convo.say('BUSTED!');
    game.busted = true;
    endGame(game, response, convo);
    convo.next();
}

function takeTurn(game, response, convo) {
    convo.say(game.user.name + ', your hand: ' + game.hand.print());
    convo.say(game.user.name + ', dealer hand: ' + game.dealer.hand.print());
    convo.ask('Would you like to "(H)IT or (S)TAY"?', [
        {
            pattern: /^(h|H|hit|Hit|HIT)/i,
            callback: function(response, convo) {
                hitCard(game, response, convo);
            }
        },
        {
            pattern: /^(s|S|stay|Stay|STAY)/i,
            callback: function(response, convo) {
                stay(game, response, convo);
            }
        },
        {
            default: true,
            callback: function(response, convo) {
                convo.repeat();
                convo.next();
            }
        }
    ]);
}

function endGame(game, response, convo) {
    game.dealer.playHand(game.deck).then(function() {
        convo.say(game.user.name + ', your hand: ' + game.hand.print());
        convo.say(game.user.name + ', dealer hand: ' + game.dealer.hand.print());
        var gameResult;
        var playerValue = game.hand.value();
        var dealerValue = game.dealer.hand.value();
        if (game.busted) {
            gameResult = 'Lost. Busted.';
        } else if (game.dealer.busted) {
            gameResult = 'Won! Dealer Busted!';
        } else if (playerValue < dealerValue) {
            gameResult = 'Lost. Dealer Beat.';
        } else if (playerValue === dealerValue) {
            gameResult = 'Push';
        } else {
            gameResult = 'Won! Beat Dealer.';
        }
        convo.say('Game ' + gameResult);
        convo.next();
    });
}
