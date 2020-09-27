import * as PIXI from 'pixi.js';
import VARS from './utils/vars.script';
export default class Card extends PIXI.Container {
    cover = new PIXI.Graphics();
    rank = undefined;
    suit = undefined;
    color = undefined;
    drawPile = false;
    constructor(rank, suitIndex) {
        super();
        this.rank = rank + 1;
        this.suit = VARS.suits[suitIndex];
        this.color = (this.suit === 'hearts' || this.suit === 'diamonds') ? "red" : "black" ;
        this.buildCard(rank, suitIndex);
        this.reveal(false);
    }
    reveal (boolean) {
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
        cardBack.drawRoundedRect(0, 0, VARS.cardWidth, VARS.cardHeight, 10);
        cardBack.endFill();
        this.addChild(cardBack)


        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xCCCCCC);
        graphics.drawRoundedRect(5, 5, VARS.cardWidth - 10, VARS.cardHeight - 10, 10);
        graphics.endFill();
        this.addChild(graphics)

        let rank = new PIXI.Text(VARS.rank[rankProp], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        rank.y = 10
        rank.x = 15;
        this.addChild(rank);

        let suit = new PIXI.Text(VARS.suits[suitIndexProp], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        suit.x = 15;
        suit.y = 22;
        this.addChild(suit)

        this.cover.beginFill(0x669900);
        this.cover.drawRoundedRect(2, 2, VARS.cardWidth - 4, VARS.cardHeight - 4, 10);
        this.cover.endFill();

        this.addChild(this.cover);
    }
}