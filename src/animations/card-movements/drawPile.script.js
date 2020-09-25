import ListenerManager from "./listener-manager";

export default {
    drawPile: [],
    topDrawPileCard: undefined,
    flipPile: [],
    topFlipPileCard: undefined,
    resetDrawPileButton: undefined,
    drag: undefined,
    testing: undefined,
    init: function (parent, drag, obj) {
        this.parent = parent;
        this.drag = drag;
        this.vars = obj.VARS;
        this.testing = obj.TESTING;
    },
    drawPileClickHandler: function (e) {

        let top3 = this.drawPile.splice(-3).reverse(), card;

        this.testing.printDeck(top3)

        for (let i = 0; i < top3.length; i ++) {
            card  = top3[i];
            card.reveal(true);
            ListenerManager.removeAllListeners(card)
            this.parent.container.addChild(card)
            card.y += this.vars.cardHeight + 20;
        }

        this.flipPile = [...this.flipPile, ...top3];

        this.topFlipPileCard = card;
        ListenerManager.addDrag(this.topFlipPileCard);

        if (this.drawPile.length === 0) {
            ListenerManager.addResetFlip(this.resetDrawPileButton); 
        } else {
            let topCard = this.drawPile[this.drawPile.length - 1];
            ListenerManager.addFlip(topCard);
        }
    
    },
    resetDrawPileHandler: function (e) {

        ListenerManager.removeResetFlip(this.resetDrawPileButton);

        this.drawPile = [...this.flipPile].reverse();
        let startY = this.vars.cardHeight + (this.parent.buffer * 4);
        let c;
       
        this.drawPile.forEach( card => {
            card.reveal(false);
            ListenerManager.removeAllListeners(card)
            card.x = 0;
            card.y = startY;
            startY += 1;
            this.parent.container.addChild(card);
            c = card;
        })
        this.testing.printDeck(this.drawPile)
        this.topDrawPileCard = c;
        ListenerManager.addFlip(this.topDrawPileCard);
        this.flipPile = [];
    },


}