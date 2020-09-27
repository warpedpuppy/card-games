import * as PIXI from 'pixi.js';
import Vars from './utils/vars.class';
export default class Card extends PIXI.Container {
    cover = new PIXI.Graphics();
    rank = undefined;
    suit = undefined;
    color = undefined;
    drawPile = false;
    constructor(rank, suitIndex) {
        super();
        this.rank = rank + 1;
        this.suit = Vars.suits[suitIndex];
        this.color = (this.suit === 'hearts' || this.suit === 'diamonds') ? "red" : "black" ;
        this.buildCard(rank, suitIndex);
        this.reveal(false);
    }
    reveal (boolean) {
        console.log("boom", boolean)
        this.cover.visible = !boolean;
    }
    makeInteractive (boolean) {
        this.interactive = this.buttonMode = boolean;
    }
    isDrawPile (boolean) {
        this.drawPile = boolean;
    }
    buildCard (rankProp, suitIndexProp) {
        const cardBack = new PIXI.Graphics();
        cardBack.beginFill(0x000000);
        cardBack.drawRoundedRect(0, 0, Vars.cardWidth, Vars.cardHeight, 10);
        cardBack.endFill();
        this.addChild(cardBack)


        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xCCCCCC);
        graphics.drawRoundedRect(5, 5, Vars.cardWidth - 10, Vars.cardHeight - 10, 10);
        graphics.endFill();
        this.addChild(graphics)

        let rank = new PIXI.Text(Vars.rank[rankProp], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        rank.y = 10
        rank.x = 15;
        this.addChild(rank);

        let suit = new PIXI.Text(Vars.suits[suitIndexProp], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        suit.x = 15;
        suit.y = 22;
        this.addChild(suit)

        this.cover.beginFill(0x669900);
        this.cover.drawRoundedRect(2, 2, Vars.cardWidth - 4, Vars.cardHeight - 4, 10);
        this.cover.endFill();

        this.addChild(this.cover);
    }
}