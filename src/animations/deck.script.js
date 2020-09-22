import CARD from './card.script';
import _ from 'lodash';
export default {
    deck: [],
    init: function (vars) {
        CARD.init(vars)
    },
    createDeck: function () {
        
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = CARD.create(j, i);
                card.this = this;
                this.deck.push(card);
            }
        }
        this.shuffle();
    },
    shuffle: function () {
        this.deck = _.shuffle(this.deck);
    },
}