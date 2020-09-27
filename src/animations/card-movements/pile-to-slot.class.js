import UTILS from '../utils/utils';
import VARS from '../utils/vars.script';
export default class PileToSlot {
    static root = undefined;
    static setRoot(root) {
        this.root = root;
    }
    static slotHitListener (activeCardObj, dragScript) {
        for (let i = 0; i < 4; i ++) {
    
            let slotObj = VARS.globalObject(dragScript.slots[i]); 

            if ( 
                UTILS.rectangleRectangleCollisionDetection(slotObj, activeCardObj) &&
                dragScript.slots[i].rank === dragScript.activeCard.rank &&
                dragScript.slots[i].suit === dragScript.activeCard.suit
            ) {
                return { hit: true, slot: dragScript.slots[i]};
            }
        }
        return {hit: false, slot: undefined};
    }
    static addCardToSlot (slot, dragScript) {
        dragScript.removeDrag(dragScript.activeCard);
        this.root.slotCont.addChild(dragScript.activeCard);
        dragScript.activeCard.x = slot.x;
        dragScript.activeCard.y = slot.y;
        let tempArray = (!dragScript.activeCard.drawPile) ? this.root.piles[dragScript.activeCard.index] : this.root.drawPile.flipPile;
        tempArray.splice(tempArray.indexOf(dragScript.activeCard), 1)
        slot.rank ++;
        this.root.revealNextCard(tempArray);
    }

}