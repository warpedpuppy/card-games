import * as PIXI from 'pixi.js';
export default {

    onDragStart: function (event) {
 
        let globalPoint = this.getGlobalPosition(new PIXI.Point(this.x, this.y))
        this.adjustX = Math.abs(event.data.global.x - globalPoint.x)
        this.adjustY = Math.abs(event.data.global.y - globalPoint.y)
        this.data = event.data;
        this.dragging = true;
    },
    onDragEnd: function () {
        this.dragging = false;
        this.data = null;
    },
    onDragMove: function () {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x - this.adjustX;
                this.y = newPosition.y - this.adjustY;
            }
    },
    addDrag: function (item) {
        item
        .on('pointerdown', this.onDragStart)
        .on('pointerup', this.onDragEnd)
        .on('pointerupoutside', this.onDragEnd)
        .on('pointermove', this.onDragMove)
    },
    removeDrag: function (item) {
        item
        .on('pointerdown', null)
        .on('pointerup', null)
        .on('pointerupoutside', null)
        .on('pointermove', null)
    }
}