import * as PIXI from 'pixi.js';
import VARS from './utils/vars.script';
import PileToPile from './card-movements/pile-to-pile';
import PileToSlot from './card-movements/pile-to-slot';

export default {
    slots: [],
    activeCard: undefined,
    tempGraphics: new PIXI.Graphics(),
    stage: undefined,
    parent: undefined,
    dragCont: new PIXI.Container(),
    drawPile: undefined,
    init: function (stage, parent, drawPile) {
        this.stage = stage;
        this.parent = parent;
        this.drawPile = drawPile;

        PileToPile.init(this);
        PileToSlot.init(this, drawPile)

        this.testCard = new PIXI.Graphics();
        this.testCard.beginFill(0x996600).drawRect(0,0,100, 150).endFill();
       // stage.addChild(this.testCard)
    },
    addSlot: function (slot) {
        this.slots.push(slot);
    },
    onDragStart: function (e) {


        this.activeCard = e.target;
        let arr = (!this.activeCard.drawPile) ? this.parent.piles[this.activeCard.index] : this.drawPile.flipPile;
       


        let globalPoint = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))

        this.dragCont.x = globalPoint.x;
        this.dragCont.y = globalPoint.y;

  


        this.dragCont.adjustX = Math.abs(e.data.global.x - globalPoint.x);
        this.dragCont.adjustY = Math.abs(e.data.global.y - globalPoint.y);
        this.dragCont.data = e.data;
        this.dragCont.dragging = true;
        this.activeCard.storePos = {x: this.activeCard.x, y: this.activeCard.y};
        
       
       let activeCardIndex = arr.indexOf(this.activeCard), yOffset = 0;
       for (let i = activeCardIndex; i < arr.length; i++) {
            arr[i].storeParent = arr[i].parent;
            arr[i].storePos = {x: arr[i].x, y: arr[i].y};
            arr[i].x = 0;
            arr[i].y = yOffset * 40;
            this.dragCont.addChild(arr[i]);
            yOffset++;
       }
       

        this.stage.addChild(this.dragCont)
    },
    onDragEnd: function () {

        if (!this.activeCard) return;

        let activeCardObj = VARS.globalObject(this.activeCard);


         //SLOT CHECK

        let slotHitObject = PileToSlot.slotHitListener(activeCardObj)
        let pileHitObject = PileToPile.movePileListener(activeCardObj, this.activeCard)
         if (this.dragCont.children.length === 1 && slotHitObject.hit) {
                let slot = slotHitObject.slot;
                PileToSlot.addCardToSlot(slot);
         } else if (pileHitObject.hit) {
            PileToPile.movePiles(pileHitObject.topCard, pileHitObject.key);
         } else {
                let tempArray = [...this.dragCont.children];
                tempArray.forEach( card => {
                    card.x = card.storePos.x;
                    card.y = card.storePos.y;
                    card.storeParent.addChild(card)
                })
         }
        this.dragCont.dragging = false;
        this.dragCont.data = null;
        this.activeCard = undefined;
        this.stage.removeChild(this.dragCont);
    },
    onDragMove: function (e) {

        if (this.activeCard && this.dragCont.dragging) {
            const newPosition = this.dragCont.data.getLocalPosition(this.dragCont.parent);
            this.dragCont.x = newPosition.x - this.dragCont.adjustX;
            this.dragCont.y = newPosition.y - this.dragCont.adjustY;
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