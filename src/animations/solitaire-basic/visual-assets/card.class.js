import * as PIXI from 'pixi.js';
import Vars from '../utils/Vars.class';

export default class Card extends PIXI.Container {
    cover = new PIXI.Graphics();
    rank = undefined;
    suit = undefined;
    color = undefined;
    drawPile = false;
    dest = undefined;
    storePos = undefined;
    storeParent = undefined;
    vx = 0;
    vy = 0;
    constructor(rank, suitIndex) {
        super();
        this.rank = rank + 1;
        this.suit = Vars.suits[suitIndex];
        this.color = (this.suit === 'hearts' || this.suit === 'diamonds') ? "red" : "black" ;
        this.buildCard(rank, suitIndex);
        this.reveal(false);
        // this.pivot.x = Vars.cardWidth / 2;
        // this.pivot.y = Vars.cardHeight / 2;
    }
    setDestination (x,y) {
        this.dest = {x, y};
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
        cardBack.drawRoundedRect(0, 0, Vars.cardWidth, Vars.cardHeight, 10);
        cardBack.endFill();
        this.addChild(cardBack)

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xCCCCCC);
        graphics.drawRoundedRect(2, 2, Vars.cardWidth - 4, Vars.cardHeight - 4, 10);
        graphics.endFill();
        this.addChild(graphics)

        let textColor = this.color === "black" ? 0x000000 : 0xFF1010 ;

        let rank = new PIXI.Text(Vars.rank[rankProp], {
            fontFamily : 'Arial Black', 
            fontSize: 10, 
            fill : textColor,
            align : 'center'});
        rank.y = 10
        rank.x = 15;
        this.addChild(rank);

        let suit = new PIXI.Text(Vars.suits[suitIndexProp], {
            fontFamily : 'Arial Black',
            fontSize: 10, 
            fill : textColor,
            align : 'center'});
        suit.x = 15;
        suit.y = 22;
        this.addChild(suit)
        
        this.cover = new PIXI.Sprite(PIXI.Texture.from('/bmps/cardBack.png'))

        this.addChild(this.cover);
    }
}