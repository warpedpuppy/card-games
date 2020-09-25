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
        console.log()
        this.vars = obj.VARS;
        this.testing = obj.TESTING;
    },
    drawPileClickHandler: function (e) {

        this.testing.howManyListeners(this.drawPile)

        if (this.topFlipPileCard && this.flipPile.indexOf(this.topFlipPileCard) !== -1) {

            this.drag.removeDrag(this.topFlipPileCard);
        }



        let drawPile = this.drawPile;
        let top3 = drawPile.splice(-3).reverse(), card;
        this.testing.printDeck(top3)

        for (let i = 0; i < top3.length; i ++) {
            card  = top3[i];
            card.reveal(true);
            card.returnCard().removeAllListeners();
            //this.parent.container.removeChild(card);
            this.parent.container.addChild(card.returnCard())
            card.returnCard().y += this.vars.cardHeight + 20;
        }
        this.topFlipPileCard = card;
       

        this.flipPile = [...this.flipPile, ...top3];
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
            topCard.returnCard().on("click", this.drawPileClickHandler.bind(this));
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
            card.returnCard().removeAllListeners();
            card.returnCard().x = 0;
            card.returnCard().y = startY;
            startY += 1;
            this.parent.container.addChild(card.returnCard());
            c = card;
        })
        this.testing.printDeck(this.drawPile)
        this.topDrawPileCard = c;
        this.topDrawPileCard.returnCard().on("click", this.drawPileClickHandler.bind(this));
        this.flipPile = [];
    },
   


}