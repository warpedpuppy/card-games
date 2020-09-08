import * as PIXI from 'pixi.js';
import _ from 'lodash';
export default {
    cardWidth: 50,
    cardHeight: 75,
    buffer: 10,
    deck: [],
    suits: ["clubs", "diamonds", "hearts", "spades"],
    rank: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    init: function () {
        const app = new PIXI.Application({
            width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("home-canvas").appendChild(app.view);
        
        this.container = new PIXI.Container();
        
        app.stage.addChild(this.container);
        
        app.ticker.add(this.ticker);

        this.createDeck();

        this.container.x = (app.stage.width - this.container.width) + (this.cardWidth / 2) / 2;
        this.container.y = (app.stage.height - this.container.height) + (this.cardHeight / 2) / 2;


    },
    card: function (counter, counter2) {
        const cont = new PIXI.Container();
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xCCCCCC);
        graphics.drawRoundedRect(0, 0, this.cardWidth, this.cardHeight, 10);
        graphics.endFill();
        cont.addChild(graphics)

        const line = new PIXI.Graphics();
        line.lineStyle(1, 0x000000, 1, 1).moveTo(0,0).lineTo(this.cardWidth, 0)
        
        cont.addChild(line)

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
        cont.rank = counter;
        cont.suit = counter2;
        return cont;
    },
    slot: function() {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRoundedRect(0, 0, this.cardWidth, this.cardHeight, 10);
        graphics.endFill();
        return graphics;
    },
    createDeck: function () {
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = this.card(j, i);
                this.deck.push(card);
                card.x = (this.cardWidth + this.buffer) * j;
                card.y = (this.cardHeight + this.buffer) * i;
                this.container.addChild(card);
            }
        }
    },
    shuffle: function () {
        this.container.removeChildren();
        this.deck = _.shuffle(this.deck);
        this.layout();
    },
    solitaireDeal: function () {
        this.container.removeChildren();
        let loopingQ = 7, rows = 7, cardCounter = 0, startX = this.cardWidth + (this.buffer * 4), startY = this.cardHeight + (this.buffer * 4);
        
        for (let i = 0; i < rows; i ++) {
            for (let j = 0; j < loopingQ; j ++) {
                let card = this.deck[cardCounter];
                card.x = startX + (this.cardWidth + this.buffer) * j;
                card.y = startY + (this.buffer * i);
                this.container.addChild(card);
                cardCounter ++;
            }
            loopingQ --;
            startX += this.cardWidth + this.buffer;
        }

        for (let i = cardCounter; i < 52; i ++) {
            let card = this.deck[i];
            card.x = 0;
            card.y = startY;
            this.container.addChild(card);
        }

        let slotCont = new PIXI.Container();

        for (let i = 0; i < 4; i++) {
            let slot = this.slot();
            slot.x = (this.cardWidth + this.buffer) * i;
            slotCont.addChild(slot);
        }
        slotCont.x = (this.container.width - slotCont.width) / 2;
        this.container.addChild(slotCont)

        this.container.x = (800 - this.container.width) / 2;
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
    ticker: function(delta) {

    }


}