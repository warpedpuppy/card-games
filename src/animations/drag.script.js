import * as PIXI from 'pixi.js';
import UTILS from '../utils/utils';
export default {
    slots: [],
    activeCard: undefined,
    tempGraphics: new PIXI.Graphics(),
    stage: undefined,
    init: function (stage) {
        this.stage = stage;
    },
    addSlot: function (slot) {
        this.slots.push(slot);
    },
    onDragStart: function (e) {
        this.activeCard = e.target;
        let globalPoint = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))
        this.activeCard.adjustX = Math.abs(e.data.global.x - globalPoint.x)
        this.activeCard.adjustY = Math.abs(e.data.global.y - globalPoint.y)
        this.activeCard.data = e.data;
        this.activeCard.dragging = true;
        let parent = this.activeCard.parent;
        this.activeCard.storePos = {x: this.activeCard.x, y: this.activeCard.y};
        parent.removeChild(this.activeCard);
        parent.addChild(this.activeCard)
    },
    onDragEnd: function () {
        this.dragging = false;
        this.data = null;
        this.activeCard.x = this.activeCard.storePos.x;
        this.activeCard.y = this.activeCard.storePos.y;
        this.activeCard = undefined;
    },
    onDragMove: function (e) {
        
        if (this.activeCard && this.activeCard.dragging) {
            const newPosition = this.activeCard.data.getLocalPosition(this.activeCard.parent);
            this.activeCard.x = newPosition.x - this.activeCard.adjustX;
            this.activeCard.y = newPosition.y - this.activeCard.adjustY;

            for (let i = 0; i < 4; i ++) {

                if(!this.activeCard)break;

                let tempPoint = this.slots[i].getGlobalPosition(new PIXI.Point(this.slots[i].x, this.slots[i].y))
                let obj = {
                    x: tempPoint.x,
                    y: tempPoint.y,
                    width: this.slots[i].width,
                    height: this.slots[i].height
                }
                let tempPoint2 = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))
                let obj2 = {
                    x: tempPoint2.x,
                    y: tempPoint2.y,
                    width: this.activeCard.width,
                    height: this.activeCard.height
                }



                if ( 
                    UTILS.rectangleRectangleCollisionDetection(obj, obj2) &&
                    this.slots[i].rank === this.activeCard.rank &&
                    this.slots[i].suit === this.activeCard.suit
                ) {
                    this.activeCard.dragging = false;
                    this.removeDrag(this.activeCard);
                    let tempParent = this.activeCard.parent;
                    let destinationParent =  this.slots[i].parent;
                    tempParent.removeChild(this.activeCard);
                    destinationParent.addChild(this.activeCard);
                    this.activeCard.x = this.slots[i].x;
                    this.activeCard.y = this.slots[i].y;
                    this.activeCard = undefined;
                    this.slots[i].rank ++;

                }
            }
        }
    },
    addDrag: function (item) {
        item
        .on('pointerdown', this.onDragStart.bind(this))
        .on('pointerup', this.onDragEnd.bind(this))
        .on('pointerupoutside', this.onDragEnd.bind(this))
        .on('pointermove', this.onDragMove.bind(this))

        item.hasDrag = true;
    },
    removeDrag: function (item) {
       // console.log(item.rank, item.suit, this)
        item.removeAllListeners();
        item.hasDrag = false;
    }
}