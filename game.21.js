var Deck = require('./deck');
var Dealer = require('./dealer');
var Hand = require('./hand');
var UserData = require('./userdata');


var game = {
    newGame: newGame
};

module.exports = game;

var _maxScore = 21;

function newGame(bot, message, storage) {
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

            var data = new UserData(user.name, storage);

            var game = {
                dealer:  dealer,
                deck:    deck,
                hand:    hand,
                user:    user,
                busted:  false,
                data:    data,
                natural: false,
                bet:     100
            };

            takeTurn(game, response, convo);
            convo.next();

            console.log('Starting game with user: ' + user.name);
        });
    }
}

/**
 * Since this is blackjack specific, we are going to leave this out of the
 * hand class.
 *
 * Natural blackjack is a value of 21 from two cards.
 */
function isNatural(hand) {
    return hand.value() === 21 && hand.cards.length === 2;
}

function hitCard(game, response, convo) {
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

    if (isNatural(game.hand)) {
        convo.say(game.user.name + ' BLACKJACK!');
        game.natural = true;
        endGame(game, response, convo);
        convo.next();
    }
    else {
        var ask = 'Would you like to "(H)IT or (S)TAY"?'
        if (canDoubleDown(game.hand)) {
            ask = 'Would you like to "(H)IT, (S)TAY or (D)OUBLE DOWN"?';
        }
        convo.ask(ask , [
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
                pattern: /^(d|D|double|Double|DOUBLE|DD|dd)/i,
                callback: function(response, convo) {
                    if(canDoubleDown(game.hand)) {
                        doubleDown(game, response, convo);
                        // doubleDown(game, response, convo);
                    }
                    else {
                        convo.repeat();
                        convo.next();
                    }
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
}

function doubleDown(game, response, convo) {
    game.bet = game.bet * 2;
    game.hand.add(game.deck.draw());
    if (game.hand.value() > _maxScore) {
        busted(game, response, convo);
    }
    else {
        endGame(game, response, convo);
    }
    convo.next();
}

function canDoubleDown(hand) {
    return hand.cards.length == 2;
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
            game.data.updateMoney(-1 * game.bet);
        } else if (game.natural) {
            if (isNatural(game.dealer.hand)) {
                // Both have blackjack, push
                gameResult = 'Push. Both Players Blackjack.';
            }  else {
                gameResult = 'Won! Blackjack!';
                game.data.updateMoney(1.5 * game.bet);
            }
        } else if (game.dealer.busted) {
            gameResult = 'Won! Dealer Busted!';
            game.data.updateMoney(1 * game.bet);
        } else if (playerValue < dealerValue) {
            gameResult = 'Lost. Dealer Beat.';
            game.data.updateMoney(-1 * game.bet);
        } else if (playerValue === dealerValue) {
            if (isNatural(game.dealer.hand)) {
                // Dealer wins with a natural blackjack
                gameResult = 'Lost. Dealer Blackjack.';
                game.data.updateMoney(-1 * game.bet);
            }  else {
                gameResult = 'Push';
            }
        } else {
            gameResult = 'Won! Beat Dealer.';
            game.data.updateMoney(1 * game.bet);
        }
        convo.say('Game ' + gameResult);
        convo.say(game.user.name + ', you have: $' + game.data.getMoney());
        convo.next();
    });
}
