import * as PIXI from 'pixi.js';
import CARD from './card.script';
import _ from 'lodash';
import DRAG from './drag.script';
import VARS from './vars.script';

export default {
    // cardWidth: 100,
    // cardHeight: 150,
    // canvasWidth: 1000,
    // canvasHeight: 800,
    buffer: 10,
    deck: [],
    drawPile: [],
    topDrawPileCard: undefined,
    flipPile: [],
    piles: {},
    init: function () {
        const app = new PIXI.Application({
            width: VARS.canvasWidth, height: VARS.canvasWidth, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("home-canvas").appendChild(app.view);
        
        this.container = new PIXI.Container();
        
        app.stage.addChild(this.container);
        
        app.ticker.add(this.ticker);

        DRAG.init(app.stage, this);
        CARD.init(VARS);

        this.createDeck();

       

    },
    slot: function(suit) {
        const container = new PIXI.Container();
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRoundedRect(0, 0, VARS.cardWidth, VARS.cardHeight, 10);
        graphics.endFill();
        container.suit = suit;
        container.rank = 1;
        container.addChild(graphics)
        return container;
    },
    cardPlacedOnSlot: function (card) {

        let tempArray = this.piles[card.index];
        //REMOVE FROM PILE
        //tempArray.forEach(card => console.log(card.suit, card.rank))
        tempArray.splice(tempArray.indexOf(card), 1)
        //tempArray.forEach(card => console.log(card.suit, card.rank))

        //FLIP TOP OF PILE
         if (tempArray.length) {
            let finalIndex = tempArray.length - 1;
            let newTopCard = tempArray[finalIndex];
            newTopCard.reveal();
            DRAG.addDrag(newTopCard);
        }
       

    },
    createDeck: function () {
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = CARD.create(j, i);
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
        let loopingQ = 7, rows = 7, cardCounter = 0, startX = VARS.cardWidth + (this.buffer * 4), startY = VARS.cardHeight + (this.buffer * 4), card, objectIndex = 7;
        
        for (let i = 0; i < rows; i ++) {

            for (let j = 0; j < loopingQ; j ++) {
                card = this.deck[cardCounter];
                card.x = startX + (VARS.cardWidth + this.buffer) * j;
                card.y = startY + (this.buffer * i);
                this.container.addChild(card);
                cardCounter ++;

                //index is the key in the object for the piles of cards.  the values will be arrays of the cards in that pile
                let index = (objectIndex - loopingQ) + j;
                card.index = index;
                //console.log(index, ": ", card.suit, card.rank)
                if (!this.piles[index]) {
                    this.piles[index] = [card]
                } else {
                    this.piles[index].push(card)
                }
                if (j === 0) {
                    card.reveal();
                    DRAG.addDrag(card);
                
                }
                
            }
            
            loopingQ --;

            startX += VARS.cardWidth + this.buffer;
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
            let slot = this.slot(VARS.suits[i]);
            slot.x = (VARS.cardWidth +( this.buffer * 15)) * i;
            DRAG.addSlot(slot);
            slotCont.addChild(slot);
        }
        slotCont.x = (this.container.width - slotCont.width) / 2;
        this.container.addChild(slotCont)
        this.container.x = (VARS.canvasWidth - this.container.width) / 2;
        this.container.y = 20;

         console.log(this.piles)

        // for (let key in this.piles) {
        //     console.log(key, ": ");
        //     this.piles[key].forEach( card => {
        //         console.log(card.suit, card.rank)
        //     })
        // }
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
    drawPileClickHandler: function (e) {

        this.topDrawPileCard.off("click", this.drawPileClickHandler);
        let drawPile = e.target.this.drawPile;
        let top3 = drawPile.splice(-3).reverse();

        for (let i = 0; i < top3.length; i ++) {
            top3[i].reveal();
            e.target.this.container.removeChild(top3[i]);
            e.target.this.container.addChild(top3[i])
            top3[i].y += VARS.cardHeight + 20;
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