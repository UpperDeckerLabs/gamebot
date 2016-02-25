var Card = require('./card');

function Deck(){
    var deck = this;
    this.cards = [];
    this.dealt = [];

    deck.suits.forEach(function (suit) {
        deck.ranks.forEach(function(rank){
            var card = new Card(rank, suit);
            deck.cards.push(card);
        })
    });
}

Deck.prototype.suits = ['C', 'D', 'S', 'H'];

Deck.prototype.ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

Deck.prototype.draw = function(){
    var card = this.cards.shift();
    if(card){
        this.dealt.push(card);
        return card;
    }
    else{
        return false;
    }
};

Deck.prototype.dealSpecificCard = function(suit, rank) {
    var cardIndex = this.cards.findIndex(function(card) {
        return card.rank === rank && card.suit === suit;
    });
    if (cardIndex) {
        var card = this.cards.splice(cardIndex, 1);
        this.dealt.push(card[0]);
        return card[0];
    }
    else {
        return false;
    }

}

Deck.prototype.shuffle = function () {
    /**
        * Knuth Shuffle Implementation
        * https://github.com/coolaj86/knuth-shuffle
        */
    var currentIndex = this.cards.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this.cards[currentIndex];
        this.cards[currentIndex] = this.cards[randomIndex];
        this.cards[randomIndex] = temporaryValue;
    }
};

Deck.prototype.reset = function () {
    this.cards = this.cards.concat(this.dealt);
    this.dealt = [];
    this.shuffle();
};

module.exports = Deck;