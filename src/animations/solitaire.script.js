import * as PIXI from 'pixi.js';
import SLOT from './slot.script';
import DECK from './deck.script';
import DRAG from './card-movements/drag.script';
import MARKER from './marker.script';
import ListenerManager from './card-movements/listener-manager';
import VARS from './utils/vars.script';
import TESTING from './utils/testing.script';
import DrawPileListeners from './card-movements/drawPileListeners.script';
import PileToSlot from './card-movements/pile-to-slot';
import PileToPile from './card-movements/pile-to-pile';
export default class SOLITAIRE {
    buffer = 10;
    buffer_larger = 40;
    slot_spacer = 100;
    deck = [];
    piles = {};
    pileMarkers = [];
    obj =  undefined;
    resetDrawPileButton =  undefined;
    drawPile =  [];
    topDrawPileCard =  undefined;
    flipPile =  [];
    topFlipPileCard =  undefined;
    gameBoard = new PIXI.Container();
    app = undefined;
    constructor (app) {
        this.deal();
        this.app = app;
        DrawPileListeners.setRoot(this);
        DRAG.setRoot(this);
        PileToSlot.setRoot(this);
       // PileToPile.setRoot(this);
    }
    deal() {

        this.gameBoard.removeChildren();
        let cardCounter = 0, 
            startX = VARS.cardWidth + this.buffer_larger, 
            startY = VARS.cardHeight + this.buffer_larger, 
            card, 
            loopingQ = 7,
            rows = loopingQ,
            totalColumns = loopingQ;
        
       // CREATE CARD PILES
       for (let i = 0; i < 7; i++) {
            let marker = MARKER.build();
            marker.index = i;
            marker.x = startX + (VARS.cardWidth + this.buffer) * i;
            marker.y = startY;
            this.gameBoard.addChild(marker);
            this.piles[i] = [marker]
        }
    
        for (let i = 0; i < rows; i ++) {
            for (let j = 0; j < loopingQ; j ++) {
            
                card = DECK.deck[cardCounter];
                card.x = startX + (VARS.cardWidth + this.buffer) * j;
                card.y = startY + (this.buffer * i);
                this.gameBoard.addChild(card);
                cardCounter ++;

                //index is the key in the object for the piles of cards.  the values will be arrays of the cards in that pile
                let index = (totalColumns - loopingQ) + j;
                card.index = index;

                card.drawPile = false;

                this.piles[index].push(card)
                
                if (j === 0) {
                    card.reveal(true);
                    card.makeInteractive(true)
                    ListenerManager.addDrag(card);
                }
            }
            
            loopingQ --;

            startX += VARS.cardWidth + this.buffer;
        }

        // DRAW PILE
        this.createDrawPileResetButton(startY);
        this.createDrawPile(cardCounter, startY);
      

        let slotCont = new PIXI.Container();

        for (let i = 0; i < 4; i++) {
            let slot = new SLOT(VARS.suits[i]);
            slot.x = (VARS.cardWidth + this.slot_spacer) * i;
            DRAG.addSlot(slot);
            slotCont.addChild(slot);
        }
        slotCont.x = (this.gameBoard.width - slotCont.width) / 2;
        this.gameBoard.addChild(slotCont)
        this.gameBoard.x = (VARS.canvasWidth - this.gameBoard.width) / 2;
        this.gameBoard.y = 20;

    };
 
    createDrawPileResetButton(startY) {
        this.resetDrawPileButton = MARKER.build();
        this.resetDrawPileButton.x = 0;
        this.resetDrawPileButton.y = startY;
        this.resetDrawPileButton.visible = false;
        this.gameBoard.addChild(this.resetDrawPileButton);
    };
    createDrawPile(cardCounter, startY) {
        let card;
        for (let i = cardCounter; i < 52; i ++) {
            card = DECK.deck[i];
            card.x = 0;
            card.y = startY;
            this.gameBoard.addChild(card);
            startY += 1;
            card.isDrawPile(true);
            this.drawPile.push(card);
        }
       TESTING.printDeck(this.drawPile)
       this.topDrawPileCard = card;

       ListenerManager.addFlip(this.topDrawPileCard);
     
    }
    revealNextCard(arr) {
        //FLIP TOP OF PILE

        if (arr.length) {
            let finalIndex = arr.length - 1;
            let newTopCard = arr[finalIndex];
            if (!newTopCard.marker) {
                newTopCard.reveal();
                ListenerManager.addDrag(newTopCard);
            }
          
        }
        

    };
}