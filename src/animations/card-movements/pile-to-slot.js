import UTILS from '../utils/utils';
import VARS from '../utils/vars.script';
export default {
    root: undefined,
    parent: undefined,
    drawPile: undefined,
    init: function (parent, drawPile) {
        this.parent = parent;
        this.root = parent.parent;
        this.drawPile = drawPile;
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
        console.log(this.root, this.root.piles, this.parent.activeCard.drawPile)
        let tempArray = (!this.parent.activeCard.drawPile) ? this.root.piles[this.parent.activeCard.index] : this.drawPile.flipPile;
        //REMOVE FROM PILE
        tempArray.splice(tempArray.indexOf(this.parent.activeCard), 1)
        //this.cardPlacedOnSlot(this.parent.activeCard);
        slot.rank ++;
        this.root.revealNextCard(tempArray);
    }

}