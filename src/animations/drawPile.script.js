export default {
    drawPile: [],
    topDrawPileCard: undefined,
    flipPile: [],
    topFlipPileCard: undefined,
    resetDrawPileButton: undefined,
    drag: undefined,
    init: function (parent, drag, vars, testing) {
        this.parent = parent;
        this.drag = drag;
        this.vars = vars;
        this.testing = testing;
    },
    drawPileClickHandler: function (e) {

        if (this.topFlipPileCard && this.flipPile.indexOf(this.topFlipPileCard) !== -1) {
            
            this.drag.removeDrag(this.topFlipPileCard);
        }

        //if (this.topFlipPileCard) this.topDrawPileCard.removeAllListeners();  //WHY THIS?


        let drawPile = this.drawPile;
        let top3 = drawPile.splice(-3).reverse(), card;
        this.testing.printDeck(top3)

        for (let i = 0; i < top3.length; i ++) {
            card  = top3[i];
            card.reveal();
            //this.parent.container.removeChild(card);
            this.parent.container.addChild(card)
            card.y += this.vars.cardHeight + 20;
        }
        this.topFlipPileCard = card;
       

        this.flipPile = [...this.flipPile, ...top3];
        
        if (this.drawPile.length === 0) {
            this.resetDrawPileButton.visible = true;
            this.resetDrawPileButton.interactive = true;
            this.resetDrawPileButton.buttonMode = true;
            this.resetDrawPileButton.on("click", this.resetDrawPileHandler.bind(this))
        } else {
            this.drag.addDrag(this.topFlipPileCard);
            this.nextCardEmpower();
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
            card.cover();
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
    nextCardEmpower: function () {
        if(this.drawPile.length) this.drawPile[this.drawPile.length - 1].on("click", this.drawPileClickHandler.bind(this));
    },


}