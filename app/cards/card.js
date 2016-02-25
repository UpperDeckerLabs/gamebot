function Card(rank, suit){
        this.rank = rank;
        this.suit = suit;
}

Card.prototype.rankValue = function() {
    if (this.rank === 'A') {
        return 14;
    }
    else if (this.rank === 'K') {
        return 13;
    }
    else if (this.rank === 'Q') {
        return 12;
    }
    else if (this.rank === 'J') {
        return 11;
    }
    else {
        return parseInt(this.rank);
    }
}

Card.prototype.name = function () {
    return this.rank + ' ' + this.suit;
};

Card.prototype.pretty = function() {
    var suitUnicodeStrings = {
        H: '♥',
        D: '♦',
        C: '♣',
        S: '♠'
    };
    var prettySuit = suitUnicodeStrings[this.suit] ? suitUnicodeStrings[this.suit] : this.suit;
    return this.rank + prettySuit;

}

module.exports = Card;