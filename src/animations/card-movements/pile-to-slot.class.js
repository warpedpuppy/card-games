import UTILS from '../utils/utils.class';
import VARS from '../utils/vars.class';
import Drag from './drag.class';
import ListenerManager from './listener-manager.class';

export default class PileToSlot {
    static root = undefined;
    static setRoot(root) {
        this.root = root;
    }
    static slotHitListener (activeCardObj) {
        for (let i = 0; i < 4; i ++) {
    
            let slotObj = VARS.globalObject(this.root.slots[i]); 

            if ( 
                UTILS.rectangleRectangleCollisionDetection(slotObj, activeCardObj) &&
                this.root.slots[i].rank === Drag.activeCard.rank &&
                this.root.slots[i].suit === Drag.activeCard.suit
            ) {
                return { hit: true, slot: this.root.slots[i]};
            }
        }
        return {hit: false, slot: undefined};
    }
    static addCardToSlot (slot) {
        ListenerManager.removeAllListeners(Drag.activeCard);
        this.root.slotCont.addChild(Drag.activeCard);
        Drag.activeCard.x = slot.x;
        Drag.activeCard.y = slot.y;
        let tempArray = (!Drag.activeCard.drawPile) ? this.root.piles[Drag.activeCard.index] : this.root.flipPile;
        tempArray.splice(tempArray.indexOf(Drag.activeCard), 1)
        slot.rank ++;
        this.root.revealNextCard(tempArray);
    }

}