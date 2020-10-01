import * as PIXI from 'pixi.js';
import Vars from '../utils/Vars.class';
import PileToPile from './Pile-to-Pile.class';
import PileToSlot from './Pile-to-Slot.class';
import Testing from '../utils/Testing.class';
import Tweening from '../utils/Tweening.class';
import Utils from '../utils/Utils.class';
export default class Drag {
    static activeCard = undefined;
    static dragCont = new PIXI.Container();
    tempGraphics =  new PIXI.Graphics();
    stage = undefined;
    parent = undefined;
    drawPile = undefined;
    root = undefined;
    static e = undefined;
    static setRoot(root) {
        this.root = root;
        PileToSlot.setRoot(root);
        PileToPile.setRoot(root);
    }
    static onDragStart (e) {

        this.activeCard = e.target;

        let lp = e.data.getLocalPosition(this.activeCard)
        this.activeCard.pivot.x = lp.x;
        this.activeCard.pivot.y = lp.y;

        let arr = (!this.activeCard.drawPile) ? this.root.piles[this.activeCard.index] : this.root.flipPile;
       
        let globalPoint = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))

        this.activeCard.storePos = {x: this.activeCard.x, y: this.activeCard.y};
        
       let activeCardIndex = arr.indexOf(this.activeCard), yOffset = 0;
        for (let i = activeCardIndex; i < arr.length; i++) {
                arr[i].storePos = {x: arr[i].x, y: arr[i].y};
                arr[i].rotation = 0;
                this.dragCont.addChild(arr[i]);
                yOffset++;
        }
       Testing.beingCarried(this.dragCont.children)

       this.root.app.stage.addChild(this.dragCont)
    }
    static onDragEnd (e) {

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
                    card.pivot.x = card.pivot.y = 0;
                    let tempX = e.data.global.x - this.root.gameBoard.x,
                        tempY = e.data.global.y - this.root.gameBoard.y;
                    card.makeInteractive(false)
                    Tweening.tween(card, Utils.randomNumberBetween(0.5, 0.95), 
                        {
                            x: [tempX, card.storePos.x], 
                            y: [tempY, card.storePos.y],
                             rotation: [card.rotation, 0]
                        }, this.onTweenComplete.bind(this, card), 'bouncePast')
                    this.root.gameBoard.addChild(card)
                })
         }

        this.dragCont.removeChildren();
        this.activeCard = undefined;
        this.root.app.stage.removeChild(this.dragCont);

        Testing.howManyListeners(this.root.deck)
    }
    static onTweenComplete (card) {

        card.makeInteractive(true)
        card.x = card.storePos.x;
        card.y = card.storePos.y;
        card.rotation = 0;
        
    }
    static onDragMove (e) {
        this.e = e;
    }
    static animate () {
        let e = this.e;
        if (this.activeCard) {
            const newPosition = e.data.getLocalPosition(this.root.app.stage);
            this.dragCont.x = this.dragCont.y = 0;
            let arr = this.dragCont.children;
            
            let posObject = {
                x: newPosition.x, 
                y: newPosition.y
            }

            this.moveBall(arr[0], posObject, 0);
            let i, cardA, cardB;
            arr[0].x = newPosition.x;
            arr[0].y = newPosition.y;
            let yOffset = 1;
            for (i = 1; i < arr.length; i++) {
                cardA = arr[i-1];
                cardB = arr[i];
                cardB.pivot.x = cardA.pivot.x;
                let yVal = yOffset * 10;
                this.moveBall(cardB, cardA, yVal);
                yOffset ++;
            };
        }
    }
    static moveBall (card, priorCard, yValAdjust) {
        var tempBallBody = card;
        card.vx += (priorCard.x - tempBallBody.x) * 0.1;
        card.vy += (priorCard.y - tempBallBody.y) * 0.1;
        card.vy += 2.5;
        card.vx *= 0.8;
        card.vy *= 0.8;
        tempBallBody.x += card.vx;
        tempBallBody.y += (card.vy + yValAdjust);
        let deg = Utils.deg2rad(card.vx);
        card.rotation = (deg * 2);
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