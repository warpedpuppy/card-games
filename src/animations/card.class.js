import * as PIXI from 'pixi.js';
export default class CARD {
    container = new PIXI.Container();
    cover = new PIXI.Graphics();
    rank = undefined;
    suit = undefined;
    color = undefined;
    vars = undefined;
    drawPile = false;
    constructor(rank, suitIndex, vars) {
        this.vars = vars;
        this.rank = rank + 1;
        this.suit = this.vars.suits[suitIndex];
        this.color = (this.suit === 'hearts' || this.suit === 'diamonds') ? "red" : "black" ;
        this.buildCard(rank, suitIndex);
        this.reveal(false);
        this.container.classRef = this;
    }
    reveal (boolean) {
        this.cover.visible = !boolean;
    }
    makeInteractive (boolean) {
        this.container.interactive = this.container.buttonMode = boolean;
    }
    isDrawPile (boolean) {
        this.drawPile = boolean;
    }
    returnCard () {
        return this.container;
    }

    buildCard (rankProp, suitIndexProp) {
        const cardBack = new PIXI.Graphics();
        cardBack.beginFill(0x000000);
        cardBack.drawRoundedRect(0, 0, this.vars.cardWidth, this.vars.cardHeight, 10);
        cardBack.endFill();
        this.container.addChild(cardBack)


        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xCCCCCC);
        graphics.drawRoundedRect(5, 5, this.vars.cardWidth - 10, this.vars.cardHeight - 10, 10);
        graphics.endFill();
        this.container.addChild(graphics)

        let rank = new PIXI.Text(this.vars.rank[rankProp], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        rank.y = 10
        rank.x = 15;
        this.container.addChild(rank);

        let suit = new PIXI.Text(this.vars.suits[suitIndexProp], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        suit.x = 15;
        suit.y = 22;
        this.container.addChild(suit)

        this.cover.beginFill(0x669900);
        this.cover.drawRoundedRect(2, 2, this.vars.cardWidth - 4, this.vars.cardHeight - 4, 10);
        this.cover.endFill();

        this.container.addChild(this.cover);
    }
}