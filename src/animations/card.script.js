import * as PIXI from 'pixi.js';

export default {
   vars: undefined,
   cont: new PIXI.Container(),
   init: function (vars) {
       this.vars = vars;
   },
    create: function (counter, counter2) {
        this.cont = new PIXI.Container();
       
        const cardBack = new PIXI.Graphics();
        cardBack.beginFill(0x000000);
        cardBack.drawRoundedRect(0, 0, this.vars.cardWidth, this.vars.cardHeight, 10);
        cardBack.endFill();
        this.cont.addChild(cardBack)


        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xCCCCCC);
        graphics.drawRoundedRect(5, 5, this.vars.cardWidth - 10, this.vars.cardHeight - 10, 10);
        graphics.endFill();
        this.cont.addChild(graphics)

        let rank = new PIXI.Text(this.vars.rank[counter], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        rank.y = 10
        rank.x = 15;
        this.cont.addChild(rank);

        let suit = new PIXI.Text(this.vars.suits[counter2], {
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        suit.x = 15;
        suit.y = 22;
        this.cont.addChild(suit)

        // CREATE PROPERTIES
        this.cont.rank = counter + 1;
        this.cont.suit = this.vars.suits[counter2];
        this.cont.color = ( this.cont.suit === 'hearts' ||  this.cont.suit === 'diamonds') ? "red" : "black" ;

        const cover = new PIXI.Graphics();
        cover.beginFill(0x669900);
        cover.drawRoundedRect(2, 2, this.vars.cardWidth - 4, this.vars.cardHeight - 4, 10);
        cover.endFill();
        cover.visible = false;
        this.cont.addChild(cover);

        this.cont.cover = function () {
            cover.visible = true;
        }
        this.cont.reveal = function () {
            cover.visible = false;
        }

        this.cont.cover();
        // cont.interactive = true;
        // cont.buttonMode = true;
        return this.cont;
    },





}