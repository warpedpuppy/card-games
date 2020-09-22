import UTILS from '../utils/utils';
import VARS from '../utils/vars.script';
export default {
    parent: undefined,
    piles: undefined,
    activeCard: undefined,
    container: undefined,
    root: undefined,
    init: function (parent) {
        this.parent = parent;
        this.root = this.parent.parent;
        this.piles = this.parent.parent.piles;
        this.container = this.parent.parent.container;
    },
    movePileListener: function (activeCardObj, activeCard) {
        this.activeCard = activeCard;
        //PILE TO PILE CHECK
        for (let key in this.piles) {
           
           //test for piles with cards
          let topCard = this.piles[key][this.piles[key].length - 1]
          
          if (!this.activeCard || !topCard || activeCard.index === key) continue;

          let topCardObj = VARS.globalObject(topCard); 

          let alternatingSuitAndOneLower = (topCard.color !== activeCard.color && topCard.rank === (activeCard.rank + 1)) ? true : false;

           if ( 
               (alternatingSuitAndOneLower || topCard.marker) &&
               UTILS.rectangleRectangleCollisionDetection(topCardObj, activeCardObj)
           ) {
               return {hit: true, topCard, key}
           } 
         
       }
       return {hit: false}
   },
   movePiles: function (topCard, key) {
       let storeIndex = this.activeCard.index;
       
       let temp = [...this.parent.dragCont.children], isDrawPile = false;
       temp.forEach ( (card, i) => {
           card.x = topCard.x;
           let yAdjust = (topCard.marker) ? ((i) * (this.root.buffer * 4)) : ((i + 1) * (this.root.buffer * 4));
           card.y = topCard.y + yAdjust;
           if (!card.drawPile) {
             this.piles[card.index].splice(this.piles[card.index].indexOf(card), 1)
           } else {
               isDrawPile = true;
               card.drawPile = false;
              this.parent.drawPile.flipPile.splice(this.parent.drawPile.flipPile.indexOf(card), 1)
           }
           
           this.piles[key].push(card);
           this.container.addChild(card);
           card.index = key;
       })

      
       if (!isDrawPile) this.root.revealNextCard(this.piles[storeIndex])
   },
}