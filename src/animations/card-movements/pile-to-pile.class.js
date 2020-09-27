import UTILS from '../utils/utils.class';
import VARS from '../utils/vars.class';
export default class PileToPile{

    static root = undefined;
    static setRoot (root) {
        this.root = root;
    }
    static movePileListener (activeCardObj, activeCard) {
        this.activeCard = activeCard;
        //PILE TO PILE CHECK
        for (let key in this.root.piles) {
           
           //test for piles with cards
          let topCard = this.root.piles[key][this.root.piles[key].length - 1];
          
          if (!this.activeCard || !topCard || activeCard.index === key) continue;

          let topCardObj = VARS.globalObject(topCard); 

          let alternatingSuitAndOneLower = (topCard.color !== activeCard.color && topCard.rank === (activeCard.rank + 1)) ;

           if ( 
               (alternatingSuitAndOneLower || topCard.marker) &&
               UTILS.rectangleRectangleCollisionDetection(topCardObj, activeCardObj)
           ) {
               return {hit: true, topCard, key}
           } 
         
       }
       return {hit: false}
   }
   static movePiles (topCard, key, dragScript) {
       let storeIndex = this.activeCard.index;
       
       let temp = [...dragScript.dragCont.children], isDrawPile = false;
       temp.forEach ( (card, i) => {
           card.x = topCard.x;
           let yAdjust = (topCard.marker) ? ((i) * (this.root.buffer * 4)) : ((i + 1) * (this.root.buffer * 4));
           card.y = topCard.y + yAdjust;
           if (!card.drawPile) {
             this.root.piles[card.index].splice(this.root.piles[card.index].indexOf(card), 1)
           } else {
               isDrawPile = true;
               card.drawPile = false;
               this.root.flipPile.splice(this.root.flipPile.indexOf(card), 1)
           }
           
           this.root.piles[key].push(card);
           this.root.gameBoard.addChild(card);
           card.index = key;
       })

      
       if (!isDrawPile) this.root.revealNextCard(this.root.piles[storeIndex])
   }
}