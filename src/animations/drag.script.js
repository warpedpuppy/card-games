import * as PIXI from 'pixi.js';
import UTILS from '../utils/utils';
export default {
    slots: [],
    activeCard: undefined,
    tempGraphics: new PIXI.Graphics(),
    stage: undefined,
    parent: undefined,
    dragCont: new PIXI.Container(),
    init: function (stage, parent) {
        this.stage = stage;
        this.parent = parent;
    },
    addSlot: function (slot) {
        this.slots.push(slot);
    },
    onDragStart: function (e) {
        this.activeCard = e.target;
         let arr = this.parent.piles[this.activeCard.index];
        //is this the top card?
        this.parent.piles[this.activeCard.index].forEach( card => {
            console.log(card.rank, card.suit)
        })
        let topCardOfPile = arr[arr.length - 1];
        if(this.activeCard === topCardOfPile) {
            console.log("top card")
        } else {
            console.log("not top card")
        }


        let globalPoint = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))
        this.dragCont.adjustX = Math.abs(e.data.global.x - globalPoint.x);
        this.dragCont.adjustY = Math.abs(e.data.global.y - globalPoint.y);
        this.dragCont.data = e.data;
        this.dragCont.dragging = true;
        let parent = this.activeCard.parent;
       // this.activeCard.storePos = {x: this.activeCard.x, y: this.activeCard.y};
        //this.activeCard.x = this.activeCard.y = 0;
       // parent.removeChild(this.activeCard);
       
       let activeCardIndex = arr.indexOf(this.activeCard), yOffset = 0;
       for (let i = activeCardIndex; i < arr.length; i++) {
            arr[i].storeParent = arr[i].parent;
            arr[i].storePos = {x: arr[i].x, y: arr[i].y};
            arr[i].x = 0;
            arr[i].y = yOffset * 40;
            this.dragCont.addChild(arr[i]);
            yOffset++;
       }
        

        parent.addChild(this.dragCont)
    },
    onDragEnd: function () {
        
        if (!this.activeCard) return;
        this.dragCont.dragging = false;
        this.dragCont.data = null;
        let tempArray = [...this.dragCont.children];
        tempArray.forEach( card => {
            card.x = card.storePos.x;
            card.y = card.storePos.y;
            card.storeParent.addChild(card)
        })
       
        this.activeCard = undefined;
        this.dragCont.parent.removeChild(this.dragCont);
    },
    onDragMove: function (e) {
        
        if (this.activeCard && this.dragCont.dragging) {
            const newPosition = this.dragCont.data.getLocalPosition(this.dragCont.parent);
            this.dragCont.x = newPosition.x - this.dragCont.adjustX;
            this.dragCont.y = newPosition.y - this.dragCont.adjustY;

            let activeCardGlobalPoint = this.activeCard.getGlobalPosition(new PIXI.Point(this.activeCard.x, this.activeCard.y))
                let activeCardObj = {
                    x: activeCardGlobalPoint.x,
                    y: activeCardGlobalPoint.y,
                    width: this.activeCard.width,
                    height: this.activeCard.height
                }

            //PILE TO PILE CHECK
            for (let key in this.parent.piles) {
                let topCard = this.parent.piles[key][this.parent.piles[key].length - 1]
               // console.log(topCard.index, topCard.rank, topCard.suit);
               if (!topCard) break;
               let tempPoint3 = topCard.getGlobalPosition(new PIXI.Point(topCard.x, topCard.y))
               let obj = {
                   x: tempPoint3.x,
                   y: tempPoint3.y,
                   width: topCard.width,
                   height: topCard.height
               }

                if ( 
                    topCard !== this.activeCard && 
                    topCard.color !== this.activeCard.color && 
                    topCard.rank === (this.activeCard.rank + 1) &&
                    UTILS.rectangleRectangleCollisionDetection(obj, activeCardObj)
                ) {
                    console.log('top card hit');

                    this.parent.switchCardPile(this.activeCard, topCard);
                    this.activeCard = undefined;
                    // remove drag listeners from card

                    // remove card from that drag pile 
                }



            }

            //SLOT CHECK
            for (let i = 0; i < 4; i ++) {

                if(!this.activeCard)break;

                let tempPoint = this.slots[i].getGlobalPosition(new PIXI.Point(this.slots[i].x, this.slots[i].y))
                let obj = {
                    x: tempPoint.x,
                    y: tempPoint.y,
                    width: this.slots[i].width,
                    height: this.slots[i].height
                }
                



                if ( 
                    UTILS.rectangleRectangleCollisionDetection(obj, activeCardObj) &&
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
                    this.parent.cardPlacedOnSlot(this.activeCard);
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