var Hand = require('./hand');
var Promise = require('bluebird');

module.exports = Dealer;

function Dealer() {
    this.hand = new Hand();
    this.minValue = 17;
    this.maxValue = 21;
    this.busted = false;
}

Dealer.prototype.addCard = addCard;
Dealer.prototype.playHand = playHand;

function addCard(card) {
    this.hand.add(card);
}

function playHand(deck) {
    var dealer = this;
    return new Promise(function(resolve) {
       // Add second card to dealer hand
        dealer.addCard(deck.draw());

        // Play
        var loop = {
            next: function(){
                if(dealer.hand.value() < dealer.minValue) {
                    dealer.addCard(deck.draw());
                    loop.next();
                }
                else{
                    loop.done();
                }
            },
            done: function(){
                if(dealer.hand.value() > dealer.maxValue){
                    dealer.busted = true;
                }
                resolve(dealer);
            }
        };

        loop.next();
    });
}
