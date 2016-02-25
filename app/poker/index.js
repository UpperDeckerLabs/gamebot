var Cards = require('../cards');

var Deck = Cards.Deck;
var Hand = Cards.Hand;
var UserData = require('../userdata');


var game = {
    newGame: newGame,
    rules: rules
};

module.exports = game;

function rules(bot, message) {
    bot.reply(message, '* Royal Straight Flush: 800:1');
    bot.reply(message, '* Straight Flush: 50:1');
    bot.reply(message, '* 4 of a kind: 40:1');
    bot.reply(message, '* Full House: 10:1');
    bot.reply(message, '* Flush: 7:1');
    bot.reply(message, '* Straight: 5:1');
    bot.reply(message, '* 3 of a Kind: 3:1');
    bot.reply(message, '* 2 Pair: 2:1');
    bot.reply(message, '* 1 Pair Jacks or Better: 1:1');
}

function newGame(bot, message, storage) {
    var user;
    bot.startConversation(message, dealHand);

    function dealHand(response, convo) {

        bot.api.users.info({user:message.user}, function(err, data) {
            user = data.user;

            // Create a new 52 card poker deck
            var deck = new Deck();
            deck.shuffle();

            var hand = new Hand();
            hand.add(deck.draw());
            hand.add(deck.draw());
            hand.add(deck.draw());
            hand.add(deck.draw());
            hand.add(deck.draw());

            var data = new UserData(user.name, storage);

            var game = {
                deck:    deck,
                hand:    hand,
                user:    user,
                data:    data,
                bet:     10
            };

            convo.say(game.user.name + ', betting: $' + game.bet);
            game.data.updateMoney(-1 * game.bet);

            takeTurn(game, response, convo);
            convo.next();

            console.log('Starting game with user: ' + user.name);
        });
    }
}

function takeTurn(game, response, convo) {
        convo.say(game.user.name + ', your hand: ' + game.hand.print());
        var ask = 'Which cards do you want to hold? "1, 2, 3, 4, 5" or "0" to hold none.';
        convo.ask(ask , [
            {
                pattern: /^[0]/i,
                callback: function(response, convo) {
                    redealHand(game, response, convo);
                    convo.next();
                }
            },
            {
                pattern: /^[1-5]/i,
                callback: function(response, convo) {
                    holdCards(game, response, convo);
                    convo.next();
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
    var multiplier = scoreHand(game.hand);
    convo.say(game.user.name + ', your hand: ' + game.hand.print());
    convo.say('Game over. Won: $' + multiplier * game.bet);
    game.data.updateMoney(multiplier * game.bet);
    convo.say(game.user.name + ', you have: $' + game.data.getMoney());
    convo.next();
}

function redealHand(game, response, convo) {
    var hand = game.hand;
    var deck = game.deck;

    hand.empty();

    hand.add(deck.draw());
    hand.add(deck.draw());
    hand.add(deck.draw());
    hand.add(deck.draw());
    hand.add(deck.draw());

    endGame(game, response, convo);
    convo.next();
}

function holdCards(game, response, convo) {
    var i;
    for (i = 1; i <= 5; i++) {
        // If it is not held, replace it
        if (response.text.indexOf(i.toString()) === -1) {
            game.hand.replace(game.deck.draw(), i - 1);
        };
    }
    endGame(game, response, convo);
    convo.next();
}

/**
 * Royal Straight Flush: 800:1
 * Straight Flush: 50:1
 * 4 of a kind: 40:1
 * Full House: 10:1
 * Flush: 7:1
 * Straight: 5:1
 * 3 of a Kind: 3:1
 * 2 Pair: 2:1
 * 1 Pair Jacks or Better: 1:1
 */

function scoreHand(hand) {
    var scoreMultiplier = 0;

    if (isRoyalFlush(hand)) {
        scoreMultiplier = 800;
    }
    else if (isStraightFlush(hand)) {
        scoreMultiplier = 50;
    }
    else if (isFourOfAKind(hand)) {
        scoreMultiplier = 40;
    }
    else if (isFullHouse(hand)) {
        scoreMultiplier = 10;
    }
    else if (isFlush(hand)) {
        scoreMultiplier = 7;
    }
    else if (isStraight(hand)) {
        scoreMultiplier = 5;
    }
    else if (isThreeOfAKind(hand)) {
        scoreMultiplier = 3;
    }
    else if (isTwoPair(hand)) {
        scoreMultiplier = 2;
    }
    else if (isPairJacksBetter(hand)) {
        scoreMultiplier = 1;
    }

    return scoreMultiplier;
}

function isRoyalFlush(hand) {
    var isIt = false;
    if (isFlush(hand) && isStraight(hand)) {
        // Has an ace and king
        isIt = hand.hasCard('A', false) && hand.hasCard('K', false);
    }
    return isIt;
}

function isFlush(hand) {
    // If all of the cards are the same suit as the first card, flush
    var suit = hand.cards[0].suit;
    return hand.countCardsType(false, suit) === 5;
}

function isStraight(hand) {
    // First sort by rank
    var cards = handSortedByRank(hand);
    // Test for A-5 Straight
    if (cards[0].rank === '2' &&
        cards[1].rank === '3' &&
        cards[2].rank === '4' &&
        cards[3].rank === '5' &&
        cards[4].rank === 'A') {
        return true;
    }
    else {
        return cards.every(function(card, index) {
            if (index === 4) {
                return true;
            }
            else {
                return card.rankValue() + 1 === cards[index + 1].rankValue();
            }
        });
    }
}

function isFourOfAKind(hand) {
    var cards = handSortedByRank(hand);
    var firstFourEqual =    cards[0].rank === cards[1].rank &&
                            cards[1].rank === cards[2].rank &&
                            cards[2].rank === cards[3].rank;
    var lastFourEqual = cards[1].rank === cards[2].rank &&
                        cards[2].rank === cards[3].rank &&
                        cards[3].rank === cards[4].rank;
    return firstFourEqual || lastFourEqual;
}

function isFullHouse(hand) {
    var cards = handSortedByRank(hand);
    var firstThreeLastTwo = cards[0].rank === cards[1].rank &&
                            cards[1].rank === cards[2].rank &&
                            cards[3].rank === cards[4].rank;
    var firstTwoLastThree = cards[0].rank === cards[1].rank &&
                            cards[2].rank === cards[3].rank &&
                            cards[3].rank === cards[4].rank;
    return firstThreeLastTwo || firstTwoLastThree;
}

function isStraightFlush(hand) {
    return isStraight(hand) && isFlush(hand);
}

function isThreeOfAKind(hand) {
    var cards = handSortedByRank(hand);
    var firstThree =    cards[0].rank === cards[1].rank &&
                        cards[1].rank === cards[2].rank;
    var middleThree =   cards[1].rank === cards[2].rank &&
                        cards[2].rank === cards[3].rank;
    var lastThree =     cards[2].rank === cards[3].rank &&
                        cards[3].rank === cards[4].rank;
    return firstThree || middleThree || lastThree;
}

function isTwoPair(hand) {
    var cards = handSortedByRank(hand);
    var firstTwo = cards[0].rank === cards[1].rank && cards[2].rank === cards[3].rank;
    var middleMissing = cards[0].rank === cards[1].rank && cards[3].rank === cards[4].rank;
    var lastTwo = cards[1].rank === cards[2].rank && cards[3].rank === cards[4].rank;
    return firstTwo || middleMissing || lastTwo;
}

function isPairJacksBetter(hand) {
    var cards = handSortedByRank(hand);
    // First two cards pair
    var oneTwo = cards[0].rank === cards[1].rank && cards[0].rankValue() > 10;
    var twoThree = cards[1].rank === cards[2].rank && cards[1].rankValue() > 10;
    var threeFour = cards[2].rank === cards[3].rank && cards[2].rankValue() > 10;
    var fourFive = cards[3].rank === cards[4].rank && cards[3].rankValue() > 10;
    return oneTwo || twoThree || threeFour || fourFive;
}

function handSortedByRank(hand) {
    var cards = hand.cards.slice();
    cards.sort(sortByRank);

    function sortByRank(cardA, cardB) {
        return cardA.rankValue() - cardB.rankValue();
    };

    return cards;
}
