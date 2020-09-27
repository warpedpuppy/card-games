// import this.root from '../solitaire.script';
import * as PIXI from 'pixi.js';
import VARS from '../utils/vars.script';
import PileToPile from './pile-to-pile';
import PileToSlot from './pile-to-slot';

export default class {
    static slots = [];
    static activeCard = undefined;
    tempGraphics =  new PIXI.Graphics();
    stage = undefined;
    parent = undefined;
    static dragCont = new PIXI.Container();
    drawPile = undefined;
    root = undefined;
    static setRoot(root) {
        this.root = root;
    }
    static addSlot(slot) {
        this.slots.push(slot);
    }
    static onDragStart (e) {


        this.activeCard = e.target;
        let arr = (!this.activeCard.drawPile) ? this.root.piles[this.activeCard.index] : this.root.flipPile;
       


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
       

       this.root.app.stage.addChild(this.dragCont)
    }
    static onDragEnd () {

        if (!this.activeCard) return;

        let activeCardObj = VARS.globalObject(this.activeCard);


         //SLOT CHECK

        let slotHitObject = PileToSlot.slotHitListener(activeCardObj, this)
        let pileHitObject = PileToPile.movePileListener(activeCardObj, this.activeCard)
         if (this.dragCont.children.length === 1 && slotHitObject.hit) {
                let slot = slotHitObject.slot;
                PileToSlot.addCardToSlot(slot, this);
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
        this.root.app.stage.removeChild(this.dragCont);
    }
    static onDragMove () {

        if (this.activeCard && this.dragCont.dragging) {
            const newPosition = this.dragCont.data.getLocalPosition(this.dragCont.parent);
            this.dragCont.x = newPosition.x - this.dragCont.adjustX;
            this.dragCont.y = newPosition.y - this.dragCont.adjustY;
        }
    }
    static addDrag (item) {
        item.makeInteractive(true)
        item
        .on('pointerdown', this.onDragStart.bind(this))
        .on('pointerup', this.onDragEnd.bind(this))
        .on('pointerupoutside', this.onDragEnd.bind(this))
        .on('pointermove', this.onDragMove.bind(this))

        item.hasDrag = true;
    }
    static removeDrag (item) {
        item.removeAllListeners();
        item.makeInteractive(false)
        item.hasDrag = false;
    }
}