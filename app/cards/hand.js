var _maxScore = 21;

function Hand() {
    this.cards = [];
}

Hand.prototype.add = add;
Hand.prototype.value = value;
Hand.prototype.print = print;
Hand.prototype.empty = empty;
Hand.prototype.replace = replace;
Hand.prototype.hasCard = hasCard;
Hand.prototype.countCardsType = countCardsType;

module.exports = Hand;

function add(card) {
    this.cards.push(card);
}

function empty() {
    this.cards = [];
}

function replace(card, index) {
    this.cards[index] = card;
}

function hasCard(rank, suit) {
    var cardFound = false;
    if (rank && suit) {
        cardFound = this.cards.some(function(card) {
            return card.rank === rank && card.suit === suit;
        });
    }
    else if (rank) {
        cardFound = this.cards.some(function(card) {
            return card.rank === rank;
        });
    }
    else if (suit) {
        cardFound = this.cards.some(function(card) {
            return card.suit === suit;
        });
    }
    return cardFound;
}

function countCardsType(rank, suit) {
    var count = 0;

    this.cards.forEach(function(card) {
        if (rank && suit) {
            if (card.rank === rank && card.suit === suit) {
                count++;
            }
        }
        else if (rank) {
            if (card.rank === rank) {
                count++;
            }
        }
        else if (suit) {
            if (card.suit === suit) {
                count++;
            }
        }
    });

    return count;
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

function print(showValue) {
    var print = '';
    this.cards.forEach(function(card) {
        print += card.pretty() + ' ';
    });
    if (showValue) {
        print += '(' + this.value() + ')';
    }
    return print;
}