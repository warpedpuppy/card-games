import * as PIXI from 'pixi.js';
import Vars from '../utils/vars.class';
import PileToPile from './pile-to-pile.class';
import PileToSlot from './pile-to-slot.class';
import Testing from '../utils/testing.class';
export default class Drag {
    static activeCard = undefined;
    static dragCont = new PIXI.Container();
    tempGraphics =  new PIXI.Graphics();
    stage = undefined;
    parent = undefined;
    drawPile = undefined;
    root = undefined;
    static setRoot(root) {
        this.root = root;
        PileToSlot.setRoot(root);
        PileToPile.setRoot(root);
    }
    static onDragStart (e) {

        this.activeCard = e.target;
        let arr = (!this.activeCard.drawPile) ? this.root.piles[this.activeCard.index] : this.root.flipPile;
       
        let globalPoint = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))
        this.dragCont.x = globalPoint.x;
        this.dragCont.y = globalPoint.y;
        this.dragCont.adjustX = Math.abs(e.data.global.x - globalPoint.x);
        this.dragCont.adjustY = Math.abs(e.data.global.y - globalPoint.y);
        this.activeCard.storePos = {x: this.activeCard.x, y: this.activeCard.y};
        
       let activeCardIndex = arr.indexOf(this.activeCard), yOffset = 0;
        for (let i = activeCardIndex; i < arr.length; i++) {
                arr[i].storePos = {x: arr[i].x, y: arr[i].y};
                arr[i].x = 0;
                arr[i].y = yOffset * 40;
                this.dragCont.addChild(arr[i]);
                yOffset++;
        }
       Testing.beingCarried(this.dragCont.children)

       this.root.app.stage.addChild(this.dragCont)
    }
    static onDragEnd () {

        if (!this.activeCard) return;

        let activeCardObj = Vars.globalObject(this.activeCard);
        let slotHitObject = PileToSlot.slotHitListener(activeCardObj, this)
        let pileHitObject = PileToPile.movePileListener(activeCardObj, this.activeCard)
         if (this.dragCont.children.length === 1 && slotHitObject.hit) {
                let slot = slotHitObject.slot;
                PileToSlot.addCardToSlot(slot, this);
         } else if (pileHitObject.hit) {
                PileToPile.movePiles(pileHitObject.topCard, pileHitObject.key, this);
         } else {
                let tempArray = [...this.dragCont.children];
                tempArray.forEach( card => {
                    card.x = card.storePos.x;
                    card.y = card.storePos.y;
                    this.root.gameBoard.addChild(card)
                })
         }

        this.dragCont.removeChildren();
        this.activeCard = undefined;
        this.root.app.stage.removeChild(this.dragCont);

        Testing.howManyListeners(this.root.deck)
    }
    static onDragMove (e) {
        if (this.activeCard) {
            const newPosition = e.data.getLocalPosition(this.dragCont.parent);
            this.dragCont.x = newPosition.x - this.dragCont.adjustX;
            this.dragCont.y = newPosition.y - this.dragCont.adjustY;
        }
    }
    static addDrag (item) {

        if (item._eventsCount > 1) return;
        item.makeInteractive(true)
        item
        .on('pointerdown', this.onDragStart.bind(this))
        .on('pointerup', this.onDragEnd.bind(this))
        .on('pointerupoutside', this.onDragEnd.bind(this))
        .on('pointermove', this.onDragMove.bind(this))

        item.hasDrag = true;
    }
}