var game = {
    newGame: newGame
};

module.exports = game;

function newGame(bot, message) {
    bot.startConversation(message, dealHand);
}

function dealHand(response, convo) {
    var hand = 'J 4';
    takeTurn(hand, response, convo);
    convo.next();
}

function hitCard(hand, response, convo) {
    convo.say('hitting');
    hand += ' 5';
    takeTurn(hand, response, convo);
    convo.next();
}

function stay(hand, response, convo) {
    convo.say('staying');
    convo.next();
}

function takeTurn(hand, response, convo) {
    convo.say('Your hand: ' + hand);
    convo.ask('Would you like to "(H)IT or (S)TAY"?', [
        {
            pattern: /^(h|H|hit|Hit|HIT)/i,
            callback: function(response, convo) {
                hitCard(hand, response, convo);
            }
        },
        {
            pattern: /^(s|S|stay|Stay|STAY)/i,
            callback: function(response, convo) {
                stay(hand, response, convo);
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