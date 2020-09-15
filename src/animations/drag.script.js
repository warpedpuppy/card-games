import * as PIXI from 'pixi.js';
import UTILS from '../utils/utils';
export default {
    slots: [],
    activeCard: undefined,
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

                let tempPoint = this.slots[i].getGlobalPosition(new PIXI.Point(this.slots[i].x, this.slots[i].y))
                let obj = {
                    x: tempPoint.x - (100 / 2),
                    y: tempPoint.y - 20,
                    width: this.slots[i].width,
                    height: this.slots[i].height
                }
                // let tempGraphics = new PIXI.Graphics();
                // tempGraphics.clear();
                // tempGraphics.beginFill(0x333333).drawRect(obj.x, obj.y, obj.width, obj.height).endFill();
                // this.slots[i].parent.parent.addChild(tempGraphics)
                // let obj2 = {
                //     x: this.activeCard.x,
                //     y: this.activeCard.y,
                //     width: this.activeCard.width,
                //     height: this.activeCard.height
                // }
                
                // console.log(obj, obj2)

                if (UTILS.rectangleRectangleCollisionDetection(obj, this.activeCard)) {
                    console.log("hit", this.slots[i].suit)
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
        item
        .on('pointerdown', null)
        .on('pointerup', null)
        .on('pointerupoutside', null)
        .on('pointermove', null)

        item.hasDrag = false;
    }
}