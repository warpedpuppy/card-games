import * as PIXI from 'pixi.js';
import Slot from './visual-assets/Slot.class';
import Deck from './visual-assets/Deck.class';
import Marker from './visual-assets/Marker.class';
import ListenerManager from './card-movements/Listener-Manager.class';
import VARS from './utils/Vars.class';
import TESTING from './utils/Testing.class';
import _ from 'lodash';

export default class Solitare {
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
    slotCont = new PIXI.Container();
    flipPile =  [];
    topFlipPileCard =  undefined;
    gameBoard = new PIXI.Container();
    app = undefined;
    slots = [];
    constructor (app) {
        this.deck = new Deck();
        this.deal();
        this.app = app;
        ListenerManager.setRoot(this);
    }
    deal() {

        this.gameBoard.removeChildren();
        
        let obj = {
            cardCounter: 0, 
            startX: VARS.cardWidth + this.buffer_larger, 
            startY: VARS.cardHeight + this.buffer_larger, 
            loopingQ:  7,
            rows:  7,
            totalColumns:  7
        }

        this.shuffle();
        
       // CARD PILES
        let { adjustedStartY, adjustedCardCounter } = this.createCardPiles(obj);

        // DRAW PILE
        this.createDrawPile(adjustedCardCounter, adjustedStartY);

        // SLOTS 
        this.createSlots();

        // PLACEMENT
        this.gameBoard.x = (VARS.canvasWidth - this.gameBoard.width) / 2;
        this.gameBoard.y = 20;

    }

    shuffle () {
        this.deck = _.shuffle(this.deck);
    }

    createSlots () {
        for (let i = 0; i < 4; i++) {
            let slot = new Slot(VARS.suits[i]);
            slot.x = (VARS.cardWidth + this.slot_spacer) * i;
            this.slots.push(slot)
            this.slotCont.addChild(slot);
        }
        this.slotCont.x = (this.gameBoard.width - this.slotCont.width) / 2;
        this.gameBoard.addChild(this.slotCont)
    }

    createCardPiles (obj) {
        let { rows, loopingQ, cardCounter, startX, startY, totalColumns } = obj;

        for (let i = 0; i < loopingQ; i++) {
            let marker = new Marker();
            marker.index = i;
            marker.x = startX + (VARS.cardWidth + this.buffer) * i;
            marker.y = startY;
            this.gameBoard.addChild(marker);
            this.piles[i] = [marker]
        }
        let card;
        for (let i = 0; i < rows; i ++) {
            for (let j = 0; j < loopingQ; j ++) {
            
                card = this.deck[cardCounter];
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

        return { adjustedCardCounter: cardCounter, adjustedStartY: startY }
    }
    
    createDrawPileResetButton(startY) {
        this.resetDrawPileButton = new Marker();
        this.resetDrawPileButton.x = 0;
        this.resetDrawPileButton.y = startY;
        this.resetDrawPileButton.visible = false;
        this.gameBoard.addChild(this.resetDrawPileButton);
    };
    createDrawPile(cardCounter, startY) {

        this.createDrawPileResetButton(startY);

        let card;
        for (let i = cardCounter; i < 52; i ++) {
            card = this.deck[i];
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
        if (arr.length) {
            let finalIndex = arr.length - 1;
            let newTopCard = arr[finalIndex];
            //console.log("add listener to ", newTopCard.suit, newTopCard.rank)
            if (!newTopCard.marker) {
                newTopCard.reveal(true);

                ListenerManager.addDrag(newTopCard);
            }
        }
    };
}