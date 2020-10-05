import Drag from './Drag.class';
import Utils from '../utils/Utils.class';
import Vars from '../utils/Vars.class';

export default class PileToPile {

    static root = undefined;
    static setRoot (root) {
        this.root = root;
    }
    static movePileListener (activeCardObj, activeCard) {
        this.activeCard = activeCard;
        for (let key in this.root.piles) {
            
          let arr = this.root.piles[key],
              topCard = arr[arr.length - 1];
          
          if (!this.activeCard || !topCard || activeCard.index === key) continue;

          let topCardObj = Vars.globalObject(topCard); 

          let alternatingSuitAndOneLower = (topCard.color !== activeCard.color && topCard.rank === (activeCard.rank + 1));

           if ( 
               (alternatingSuitAndOneLower || topCard.marker) &&
               Utils.rectangleRectangleCollisionDetection(topCardObj, activeCardObj)
           ) {
               return {hit: true, topCard, key}
           } 
         
       }
       return {hit: false}
   }
   static movePiles (topCard, key) {
       
       let temp = [...Drag.dragCont.children], 
           arr;
       temp.forEach ( (card, i) => {

           card.x = topCard.x;
           card.pivot.set(0)
           card.rotation.set(0)

           let yAdjust = (topCard.marker) ? 
            ( i * this.root.buffer_larger ) : 
            ((i + 1) * this.root.buffer_larger ) ;

           card.y = topCard.y + yAdjust;

           if (!card.drawPile) {
             this.root.piles[card.index].splice(this.root.piles[card.index].indexOf(card), 1)
             arr = this.root.piles[card.index];
           } else {
               card.drawPile = false;
               this.root.flipPile.splice(this.root.flipPile.indexOf(card), 1);
               arr = this.root.flipPile;
           }
           
           this.root.piles[key].push(card);
           this.root.gameBoard.addChild(card);
           card.index = key;
       })
       this.root.revealNextCard(arr)
   }
}