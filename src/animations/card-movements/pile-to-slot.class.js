import UTILS from '../utils/utils.class';
import VARS from '../utils/vars.class';
import DRAG from './drag.class';

export default class PileToSlot {
    static root = undefined;
    static setRoot(root) {
        this.root = root;
    }
    static slotHitListener (activeCardObj) {
        for (let i = 0; i < 4; i ++) {
    
            let slotObj = VARS.globalObject(DRAG.slots[i]); 

            if ( 
                UTILS.rectangleRectangleCollisionDetection(slotObj, activeCardObj) &&
                DRAG.slots[i].rank === DRAG.activeCard.rank &&
                DRAG.slots[i].suit === DRAG.activeCard.suit
            ) {
                return { hit: true, slot: DRAG.slots[i]};
            }
        }
        return {hit: false, slot: undefined};
    }
    static addCardToSlot (slot) {
        DRAG.removeDrag(DRAG.activeCard);
        this.root.slotCont.addChild(DRAG.activeCard);
        DRAG.activeCard.x = slot.x;
        DRAG.activeCard.y = slot.y;
        let tempArray = (!DRAG.activeCard.drawPile) ? this.root.piles[DRAG.activeCard.index] : this.root.drawPile.flipPile;
        tempArray.splice(tempArray.indexOf(DRAG.activeCard), 1)
        slot.rank ++;
        this.root.revealNextCard(tempArray);
    }

}