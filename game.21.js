var Deck = require('./deck');

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

            // Create a new 52 card poker deck
            var deck = new Deck();
            deck.shuffle();

            var hand = [];

            hand.push(deck.draw());
            hand.push(deck.draw());

            var game = {
                deck: deck,
                hand: hand,
                user: user
            };

            takeTurn(game, response, convo);
            convo.next();

            console.log('Starting game with user: ' + user.name);
        });
    }
}

function hitCard(game, response, convo) {
    convo.say('hitting');
    game.hand.push(game.deck.draw());
    if (handValue(game.hand) > _maxScore) {
        busted(game, response, convo);
    }
    else {
        takeTurn(game, response, convo);
    }
    convo.next();
}

function stay(game, response, convo) {
    convo.say('staying');
    convo.next();
}

function busted(game, response, convo) {
    convo.say(game.user.name + ', your hand: ' + printHand(game.hand));
    convo.say('BUSTED!');
    convo.next();
}

function takeTurn(game, response, convo) {
    convo.say(game.user.name + ', your hand: ' + printHand(game.hand));
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

function printHand(hand) {
    var print = '';
    hand.forEach(function(card) {
        print += card.pretty() + ' ';
    });
    print += '(' + handValue(hand) + ')';
    return print;
}

function handValue(hand){
    var aces = 0;
    var totalValue = 0;
    var faceRanks = ['J','Q','K'];

    // Get the values of each card (counting 1 for each ace)
    hand.forEach(function(card){
        // Face Cards
        if(faceRanks.indexOf(card.rank) !== -1){
            totalValue += 10;
        }
        // Aces
        else if(card.rank === 'A'){
            totalValue += 1;
            aces++;
        }
        // Number Cards
        else {
            totalValue += Number(card.rank);
        }
    });

    // Loop through aces and try to add 10 to get highest value of hand
    // We are adding 10 here because we already added 1 for the ace above
    for(var i=0; i<aces; i++){
        // Only add 10 if we can without busting
        if(totalValue <= _maxScore - 10){
            totalValue += 10;
        }
    }

    return totalValue;
}