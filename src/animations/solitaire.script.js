import SLOT from './slot.script';
import DRAG from './drag.script';
import DRAWPILE from './drawPile.script';
import MARKER from './marker.script';

export default {
    buffer: 10,
    deck: [],
    piles: {},
    pileMarkers: [],
    obj: undefined,
    container: undefined,
    init: function (obj) {
        
        this.obj = obj;

        DRAG.init(obj.app.stage, this, DRAWPILE);
        DRAWPILE.init(this, DRAG, obj);
        SLOT.init(obj.VARS);
        MARKER.init(obj.VARS);

        this.container = new obj.PIXI.Container();
        obj.app.stage.addChild(this.container);
    },
    deal: function () {

        this.container.removeChildren();
        let cardCounter = 0, 
            startX = this.obj.VARS.cardWidth + (this.buffer * 4), 
            startY = this.obj.VARS.cardHeight + (this.buffer * 4), 
            card, 
            loopingQ = 7,
            rows = loopingQ,
            totalColumns = loopingQ;
        
        for (let i = 0; i < 7; i++) {
            let marker = MARKER.build();
            marker.index = i;
            marker.x = startX + (this.obj.VARS.cardWidth + this.buffer) * i;
            marker.y = startY;
            this.container.addChild(marker);
            this.piles[i] = [marker]
        }
        
        for (let i = 0; i < rows; i ++) {
            for (let j = 0; j < loopingQ; j ++) {
               
                card = this.obj.DECK.deck[cardCounter];
                card.x = startX + (this.obj.VARS.cardWidth + this.buffer) * j;
                card.y = startY + (this.buffer * i);
                this.container.addChild(card.returnCard());
                cardCounter ++;

                //index is the key in the object for the piles of cards.  the values will be arrays of the cards in that pile
                let index = (totalColumns - loopingQ) + j;
                card.index = index;

                card.drawPile = false;

                this.piles[index].push(card)
                
                if (j === 0) {
                    card.reveal();
                    DRAG.addDrag(card);
                }
            }
            
            loopingQ --;

            startX += this.obj.VARS.cardWidth + this.buffer;
        }

        // DRAW PILE
        this.createDrawPileResetButton(startY);
        this.createDrawPile(cardCounter, startY);
      

        let slotCont = new this.obj.PIXI.Container();

        for (let i = 0; i < 4; i++) {
            let slot = SLOT.build(this.obj.VARS.suits[i]);
            slot.x = (this.obj.VARS.cardWidth +( this.buffer * 15)) * i;
            DRAG.addSlot(slot);
            slotCont.addChild(slot);
        }
        slotCont.x = (this.container.width - slotCont.width) / 2;
        this.container.addChild(slotCont)
        this.container.x = (this.obj.VARS.canvasWidth - this.container.width) / 2;
        this.container.y = 20;

    },
    createDrawPileResetButton: function (startY) {
        DRAWPILE.resetDrawPileButton = MARKER.build();
        DRAWPILE.resetDrawPileButton.x = 0;
        DRAWPILE.resetDrawPileButton.y = startY;
        DRAWPILE.resetDrawPileButton.visible = false;
        this.container.addChild(DRAWPILE.resetDrawPileButton);
    },
    createDrawPile: function (cardCounter, startY) {
        let card;
        for (let i = cardCounter; i < 52; i ++) {
            card = this.obj.DECK.deck[i];
            card.returnCard().x = 0;
            card.returnCard().y = startY;
            this.container.addChild(card.returnCard());
            startY += 1;
            card.isDrawPile(true);
            DRAWPILE.drawPile.push(card);
        }
       this.obj.TESTING.printDeck(DRAWPILE.drawPile)
       this.topDrawPileCard = card;
       this.topDrawPileCard.makeInteractive(true)
       this.topDrawPileCard.returnCard().on("click", DRAWPILE.drawPileClickHandler.bind(DRAWPILE));
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
}