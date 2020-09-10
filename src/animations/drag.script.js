import * as PIXI from 'pixi.js';
export default {

    onDragStart: function (event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    },
    onDragEnd: function () {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
    },
    onDragMove: function () {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
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