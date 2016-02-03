function Card(rank, suit){
        this.rank = rank;
        this.suit = suit;
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