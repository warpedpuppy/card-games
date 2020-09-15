import * as PIXI from 'pixi.js';
import _ from 'lodash';
import DRAG from './drag.script';


export default {
    cardWidth: 100,
    cardHeight: 150,
    canvasWidth: 1000,
    canvasHeight: 800,
    buffer: 10,
    deck: [],
    drawPile: [],
    topDrawPileCard: undefined,
    flipPile: [],
    suits: ["clubs", "diamonds", "hearts", "spades"],
    rank: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    init: function () {
        const app = new PIXI.Application({
            width: this.canvasWidth, height: this.canvasWidth, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("home-canvas").appendChild(app.view);
        
        this.container = new PIXI.Container();
        
        app.stage.addChild(this.container);
        
        app.ticker.add(this.ticker);

        this.createDeck();


    },
    card: function (counter, counter2) {
        const cont = new PIXI.Container();

        const cardBack = new PIXI.Graphics();
        cardBack.beginFill(0x000000);
        cardBack.drawRoundedRect(0, 0, this.cardWidth, this.cardHeight, 10);
        cardBack.endFill();
        cont.addChild(cardBack)


        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xCCCCCC);
        graphics.drawRoundedRect(2, 2, this.cardWidth - 4, this.cardHeight - 4, 10);
        graphics.endFill();
        cont.addChild(graphics)

        let rank = new PIXI.Text(this.rank[counter],{
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        rank.y = 10
        rank.x = 5;
        cont.addChild(rank);

        let suit = new PIXI.Text(this.suits[counter2],{
            fontFamily : 'Arial', 
            fontSize: 10, 
            fill : 0xff1010,
            align : 'center'});
        suit.x = 5;
        suit.y = 22;
        cont.addChild(suit)

        // CREATE PROPERTIES
        cont.rank = counter + 1;
        cont.suit = counter2;

        const cover = new PIXI.Graphics();
        cover.beginFill(0x669900);
        cover.drawRoundedRect(2, 2, this.cardWidth - 4, this.cardHeight - 4, 10);
        cover.endFill();
        cover.visible = false;
        cont.addChild(cover)

        cont.cover = function () {
            cover.visible = true;
        }
        cont.reveal = function () {
            cover.visible = false;
        }

        cont.cover();
        cont.interactive = true;
        cont.buttonMode = true;
        return cont;
    },
    slot: function(suit) {
        const container = new PIXI.Container();
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRoundedRect(0, 0, this.cardWidth, this.cardHeight, 10);
        graphics.endFill();
        container.suit = suit;
        container.addChild(graphics)
        return container;
    },
    createDeck: function () {
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = this.card(j, i);
                card.this = this;
                this.deck.push(card);
            }
        }
        this.solitaireDeal();
        this.drawPileClickHandler = this.drawPileClickHandler.bind(this)
    },
    shuffle: function () {
        this.container.removeChildren();
        this.deck = _.shuffle(this.deck);
        this.layout();
    },
    solitaireDeal: function () {

        this.container.removeChildren();
        let loopingQ = 7, rows = 7, cardCounter = 0, startX = this.cardWidth + (this.buffer * 4), startY = this.cardHeight + (this.buffer * 4), card;
        
        for (let i = 0; i < rows; i ++) {
            for (let j = 0; j < loopingQ; j ++) {
                card = this.deck[cardCounter];
                card.x = startX + (this.cardWidth + this.buffer) * j;
                card.y = startY + (this.buffer * i);
                this.container.addChild(card);
                cardCounter ++;
                if (j === 0) {
                    card.reveal();
                    DRAG.addDrag(card);
                
                }
            }
            
            loopingQ --;
            startX += this.cardWidth + this.buffer;
        }
        for (let i = cardCounter; i < 52; i ++) {
            card = this.deck[i];
            card.x = 0;
            card.y = startY;
            this.container.addChild(card);
            startY += 1
            this.drawPile.push(card);
        }

       // DRAG.addDrag(card)
       this.topDrawPileCard = card;
       this.topDrawPileCard.on("click", this.drawPileClickHandler.bind(this));

        let slotCont = new PIXI.Container();

        for (let i = 0; i < 4; i++) {
            let slot = this.slot(this.suits[i]);
            slot.x = (this.cardWidth +( this.buffer * 4)) * i;
            DRAG.addSlot(slot);
            slotCont.addChild(slot);
        }
        slotCont.x = (this.container.width - slotCont.width) / 2;
        this.container.addChild(slotCont)
        this.container.x = (this.canvasWidth - this.container.width) / 2;
        this.container.y = 20;
    },
    layout: function () {
        let counter = 0;
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = this.deck[counter];
                card.x = (this.cardWidth + this.buffer) * j;
                card.y = (this.cardHeight + this.buffer) * i;
                this.container.addChild(card);
                counter ++;
            }
        }
    },
    drawPileClickHandler: function (e) {

        this.topDrawPileCard.off("click", this.drawPileClickHandler);
        let drawPile = e.target.this.drawPile;
        let top3 = drawPile.splice(-3).reverse();

        for (let i = 0; i < top3.length; i ++) {
            top3[i].reveal();
            e.target.this.container.removeChild(top3[i]);
            e.target.this.container.addChild(top3[i])
            top3[i].y += this.cardHeight + 20;
        }

        e.target.this.flipPile = [...e.target.this.flipPile, ...top3];
        
        e.target.this.nextCardEmpower();
        
    },
    nextCardEmpower: function (){
        if(this.drawPile.length) this.drawPile[this.drawPile.length - 1].on("click", this.drawPileClickHandler);
    },
    testing: function () {
        //console.log("draw pile length = ", this.drawPile.length, "this flip pile length = ", this.flipPile.length)
        // this.deck.forEach( item => {
        //     console.log('deck: ', item.rank, item.suit)
        // })
        // this.flipPile.forEach( item => {
        //     console.log('flip pile: ', item.rank, item.suit)
        // })
    },
    ticker: function(delta) {

    }


}