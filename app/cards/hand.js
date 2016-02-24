var _maxScore = 21;

function Hand() {
    this.cards = [];
}

Hand.prototype.add = add;
Hand.prototype.value = value;
Hand.prototype.print = print;

module.exports = Hand;

function add(card) {
    this.cards.push(card);
}

function value() {
    var aces = 0;
    var totalValue = 0;
    var faceRanks = ['J','Q','K'];

    // Get the values of each card (counting 1 for each ace)
    this.cards.forEach(function(card){
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

function print() {
    var print = '';
    this.cards.forEach(function(card) {
        print += card.pretty() + ' ';
    });
    print += '(' + this.value() + ')';
    return print;
}