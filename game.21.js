var Deck = require('./deck');

var game = {
    newGame: newGame
};

module.exports = game;

var _maxScore = 21;

function newGame(bot, message) {
    bot.startConversation(message, dealHand);
}

function dealHand(response, convo) {
    // Create a new 52 card poker deck
    var deck = new Deck();
    deck.shuffle();

    var hand = [];

    hand.push(deck.draw());
    hand.push(deck.draw());

    takeTurn(deck, hand, response, convo);
    convo.next();
}

function hitCard(deck, hand, response, convo) {
    convo.say('hitting');
    hand.push(deck.draw());
    if (handValue(hand) > _maxScore) {
        busted(deck, hand, response, convo);
    }
    else {
        takeTurn(deck, hand, response, convo);
    }
    convo.next();
}

function stay(deck, hand, response, convo) {
    convo.say('staying');
    convo.next();
}

function busted(deck, hand, response, convo) {
    convo.say('Your hand: ' + printHand(hand));
    convo.say('BUSTED!');
    convo.next();
}

function takeTurn(deck, hand, response, convo) {
    convo.say('Your hand: ' + printHand(hand));
    convo.ask('Would you like to "(H)IT or (S)TAY"?', [
        {
            pattern: /^(h|H|hit|Hit|HIT)/i,
            callback: function(response, convo) {
                hitCard(deck, hand, response, convo);
            }
        },
        {
            pattern: /^(s|S|stay|Stay|STAY)/i,
            callback: function(response, convo) {
                stay(deck, hand, response, convo);
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