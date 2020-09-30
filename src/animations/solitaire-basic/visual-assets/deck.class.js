import Card from './Card.class';

export default class Deck extends Array {
    
    constructor() {
        super();
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = new Card(j, i);
                card.this = this;
                this.push(card);
            }
        }
    }

}