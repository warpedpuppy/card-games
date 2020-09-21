import * as PIXI from 'pixi.js';
import DECK from './deck.script';
import DRAG from './drag.script';
import VARS from './vars.script';

export default {
 
    buffer: 10,
    deck: [],
    drawPile: [],
    topDrawPileCard: undefined,
    flipPile: [],
    piles: {},
    pileMarkers: [],
    init: function () {
        const app = new PIXI.Application({
            width: VARS.canvasWidth, height: VARS.canvasWidth, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("home-canvas").appendChild(app.view);
        
        this.container = new PIXI.Container();
        
        app.stage.addChild(this.container);
        this.app = app;
        
        app.ticker.add(this.ticker);

        DRAG.init(app.stage, this);
        DECK.init(VARS);

        DECK.createDeck();

        this.solitaireDeal();
        this.drawPileClickHandler = this.drawPileClickHandler.bind(this)
       

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
    switchCardPile: function (activeCard, topCard) {


        // //remove card from current pile
        // this.piles[activeCard.index].splice(this.piles[activeCard.index].indexOf(activeCard), 1)

        // //FLIP TOP OF PILE
        // this.revealNextCard(this.piles[activeCard.index]);
        // // let tempArray = this.piles[activeCard.index];
        // // if (tempArray.length) {
        // //     let finalIndex = tempArray.length - 1;
        // //     let newTopCard = tempArray[finalIndex];
        // //     newTopCard.reveal();
        // //     DRAG.addDrag(newTopCard);
        // // }

        // //add card to new pile
        // this.piles[topCard.index].push(activeCard);
        // activeCard.x = topCard.x;
        // activeCard.y = topCard.y + (this.buffer * 4);
        // activeCard.index = topCard.index;

        // topCard.parent.addChild(activeCard)
        
        

    },
    marker: function () {
        let marker = new PIXI.Graphics();
        marker.marker = true;
        marker.beginFill(0x000000).drawRect(0,0,VARS.cardWidth, VARS.cardHeight).endFill();
        return marker;
    },
    cardPlacedOnSlot: function (card) {

        let tempArray = this.piles[card.index];
        //REMOVE FROM PILE
        tempArray.splice(tempArray.indexOf(card), 1)

        //FLIP TOP OF PILE
        this.revealNextCard(tempArray);
       

    },
    revealNextCard: function (arr) {
        //FLIP TOP OF PILE

        if (arr.length) {
            let finalIndex = arr.length - 1;
            let newTopCard = arr[finalIndex];
            if (!newTopCard.marker) {
                newTopCard.reveal();
                DRAG.addDrag(newTopCard);
            }
          
        }
        

    },
    solitaireDeal: function () {

        this.container.removeChildren();
        let loopingQ = 7, rows = 7, cardCounter = 0, startX = VARS.cardWidth + (this.buffer * 4), startY = VARS.cardHeight + (this.buffer * 4), card, objectIndex = 7;
        
        for (let i = 0; i < 7; i++) {
            let marker = new this.marker();
            marker.index = i;
            marker.x = startX + (VARS.cardWidth + this.buffer) * i;
            marker.y = startY;
            this.container.addChild(marker);
            this.piles[i] = [marker]
        }
        
        for (let i = 0; i < rows; i ++) {

            for (let j = 0; j < loopingQ; j ++) {
               
                card = DECK.deck[cardCounter];
                card.x = startX + (VARS.cardWidth + this.buffer) * j;
                card.y = startY + (this.buffer * i);
                this.container.addChild(card);
                cardCounter ++;

                //index is the key in the object for the piles of cards.  the values will be arrays of the cards in that pile
                let index = (objectIndex - loopingQ) + j;
                card.index = index;

                this.piles[index].push(card)
                
                if (j === 0) {
                    card.reveal();
                    DRAG.addDrag(card);
                
                }
                
            }
            
            loopingQ --;

            startX += VARS.cardWidth + this.buffer;
        }
        for (let i = cardCounter; i < 52; i ++) {
            card = DECK.deck[i];
            card.x = 0;
            card.y = startY;
            this.container.addChild(card);
            startY += 1
            this.drawPile.push(card);
        }

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

    },
    layout: function () {
        let counter = 0;
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j++) {
                let card = DECK.deck[counter];
                card.x = (VARS.cardWidth + this.buffer) * j;
                card.y = (VARS.cardHeight + this.buffer) * i;
                this.container.addChild(card);
                counter ++;
            }
        }
    },
    drawPileClickHandler: function (e) {
        this.topDrawPileCard.off("click", this.drawPileClickHandler);
        let drawPile = this.drawPile;
        let top3 = drawPile.splice(-3).reverse();

        for (let i = 0; i < top3.length; i ++) {
            top3[i].reveal();
            this.container.removeChild(top3[i]);
            this.container.addChild(top3[i])
            top3[i].y += VARS.cardHeight + 20;
        }

        this.flipPile = [...this.flipPile, ...top3];
        
        this.nextCardEmpower();
        
    },
    nextCardEmpower: function (){
        if(this.drawPile.length) this.drawPile[this.drawPile.length - 1].on("click", this.drawPileClickHandler);
    },
    ticker: function(delta) {

    }


}