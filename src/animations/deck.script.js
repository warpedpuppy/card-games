// import CARD from './card.script';
import CARD from './card.class';
import _ from 'lodash';
import VARS from './utils/vars.script';
export default {
    deck: [],
    init: function (vars) {
        //CARD.init(vars)
    },
    createDeck: function () {
        
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = new CARD(j, i, VARS);
                card.this = this;
                this.deck.push(card);
            }
        }
        this.shuffle();
    },
    shuffle: function () {
        this.deck = _.shuffle(this.deck);
    },
    layout: function () {
        let counter = 0;
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = this.deck[counter];
                card.x = (VARS.cardWidth + this.buffer) * j;
                card.y = (VARS.cardHeight + this.buffer) * i;

                this.container.addChild(card);
                counter ++;
            }
        }
    },
}