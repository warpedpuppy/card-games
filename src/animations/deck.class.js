// import CARD from './card.script';
import CARD from './card.class';
import _ from 'lodash';
import VARS from './utils/vars.class';
export default class Deck extends Array {
    
    constructor() {
        super();
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = new CARD(j, i);
                card.this = this;
                this.push(card);
            }
        }
        this.shuffle();
    }
    shuffle () {
        this.deck = _.shuffle(this.deck);
    }
    layout() {
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
    }
}