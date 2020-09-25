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
            card.removeAllListeners();
            this.parent.container.addChild(card)
            card.y += this.vars.cardHeight + 20;
        }

        this.flipPile = [...this.flipPile, ...top3];

        this.topFlipPileCard = card;
        this.topFlipPileCard.makeInteractive(true)
        this.drag.addDrag(this.topFlipPileCard);

        if (this.drawPile.length === 0) {
            this.resetDrawPileButton.visible = true;
            this.resetDrawPileButton.interactive = this.resetDrawPileButton.buttonMode = true;
            this.resetDrawPileButton.on("click", this.resetDrawPileHandler.bind(this))
        } else {
            this.nextCardEmpower();
        }
    
    },
    nextCardEmpower: function () {
        if(this.drawPile.length) {
            let topCard = this.drawPile[this.drawPile.length - 1];
            topCard.makeInteractive(true)
            topCard.on("click", this.drawPileClickHandler.bind(this));
        }
    },
    resetDrawPileHandler: function (e) {

        this.resetDrawPileButton.visible = false;
        this.resetDrawPileButton.interactive = false;
        this.resetDrawPileButton.buttonMode = false;
        this.resetDrawPileButton.removeAllListeners();
        this.drawPile = [...this.flipPile].reverse();
        let startY = this.vars.cardHeight + (this.parent.buffer * 4);
        let c;
       
        this.drawPile.forEach( card => {
            card.reveal(false);
            card.removeAllListeners();
            card.x = 0;
            card.y = startY;
            startY += 1;
            this.parent.container.addChild(card);
            c = card;
        })
        this.testing.printDeck(this.drawPile)
        this.topDrawPileCard = c;
        this.topDrawPileCard.on("click", this.drawPileClickHandler.bind(this));
        this.flipPile = [];
    },


}