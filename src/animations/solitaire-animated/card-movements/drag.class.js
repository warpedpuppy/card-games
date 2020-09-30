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
        let arr = (!this.activeCard.drawPile) ? this.root.piles[this.activeCard.index] : this.root.flipPile;
       
        let globalPoint = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))
        // this.dragCont.x = globalPoint.x;
        // this.dragCont.y = globalPoint.y;
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
                    let tempX = e.data.global.x - this.root.gameBoard.x - this.dragCont.adjustX,
                        tempY = e.data.global.y - this.root.gameBoard.y - this.dragCont.adjustY;
                    card.makeInteractive(false)
                    Tweening.tween(card, Utils.randomNumberBetween(0.5, 0.95), 
                        {
                            x: [tempX, card.storePos.x], 
                            y: [tempY, card.storePos.y],
                            // rotation: [360, 0]
                        }, this.onTweenComplete.bind(this, card), 'bounce')
                    this.root.gameBoard.addChild(card)
                })
         }

        this.dragCont.removeChildren();
        this.activeCard = undefined;
        this.root.app.stage.removeChild(this.dragCont);

        Testing.howManyListeners(this.root.deck)
    }
    static onTweenComplete (card) {
        console.log("done", card)
        card.makeInteractive(true)
        card.x = card.storePos.x;
        card.y = card.storePos.y;
    }
    static onDragMove (e) {
        this.e = e;
        // if (this.activeCard) {
        //     const newPosition = e.data.getLocalPosition(this.dragCont.parent);
        //     // this.dragCont.x = newPosition.x - this.dragCont.adjustX;
        //     // this.dragCont.y = newPosition.y - this.dragCont.adjustY;
        //     this.dragCont.x = this.dragCont.y = 0;
        //     let arr = this.dragCont.children;
        //     this.moveBall(arr[0], newPosition.x - this.dragCont.adjustX, newPosition.y - this.dragCont.adjustY);
        //     let i, ballA, ballB;
        //     arr[0].x = newPosition.x - this.dragCont.adjustX;
        //     arr[0].y = newPosition.y - this.dragCont.adjustY;
        //     let yOffset = 1;
        //     for (i = 1; i < arr.length; i++) {
        //         ballA = arr[i-1];
        //         ballB = arr[i];
        //         let yVal = yOffset * 40;
        //         this.moveBall(ballB, ballA.x, ballA.y, yVal);
        //         yOffset ++;
        //     };
        // }
    }
    static animate () {
        let e = this.e;
        if (this.activeCard) {
            const newPosition = e.data.getLocalPosition(this.dragCont.parent);
            // this.dragCont.x = newPosition.x - this.dragCont.adjustX;
            // this.dragCont.y = newPosition.y - this.dragCont.adjustY;
            this.dragCont.x = this.dragCont.y = 0;
            let arr = this.dragCont.children;
            this.moveBall(arr[0], newPosition.x - this.dragCont.adjustX, newPosition.y - this.dragCont.adjustY);
            let i, ballA, ballB;
            arr[0].x = newPosition.x - this.dragCont.adjustX;
            arr[0].y = newPosition.y - this.dragCont.adjustY;
            let yOffset = 1;
            for (i = 1; i < arr.length; i++) {
                ballA = arr[i-1];
                ballB = arr[i];
                let yVal = yOffset * 40;
                this.moveBall(ballB, ballA.x, ballA.y, yVal);
                yOffset ++;
            };
        }
    }
    static moveBall (ball, targetX, targetY, yVal) {
        var tempBallBody = ball;
        ball.vx += (targetX - tempBallBody.x) * 0.1;
        ball.vy += (targetY - tempBallBody.y) * 0.1;
        ball.vy += 2.5;
        ball.vx *= 0.8;
        ball.vy *= 0.8;
        tempBallBody.x += ball.vx;
        tempBallBody.y = targetY + yVal;
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