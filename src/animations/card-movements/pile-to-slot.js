import UTILS from '../utils/utils';
import VARS from '../vars.script';
export default {
    root: undefined,
    parent: undefined,
    init: function (parent) {
        this.parent = parent;
        this.root = parent.parent;
    },
    slotHitListener: function (activeCardObj) {
        for (let i = 0; i < 4; i ++) {
    
            let slotObj = VARS.globalObject(this.parent.slots[i]); 

            if ( 
                UTILS.rectangleRectangleCollisionDetection(slotObj, activeCardObj) &&
                this.parent.slots[i].rank === this.parent.activeCard.rank &&
                this.parent.slots[i].suit === this.parent.activeCard.suit
            ) {
                return { hit: true, slot: this.parent.slots[i]};
            }
        }
        return {hit: false, slot: undefined};
    },
    addCardToSlot: function (slot) {
        this.parent.removeDrag(this.parent.activeCard);
        let destinationParent = slot.parent;
        destinationParent.addChild(this.parent.activeCard);
        this.parent.activeCard.x = slot.x;
        this.parent.activeCard.y = slot.y;
        this.root.cardPlacedOnSlot(this.parent.activeCard);
        slot.rank ++;
    },




}