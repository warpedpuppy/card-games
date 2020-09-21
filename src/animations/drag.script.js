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

        this.testCard = new PIXI.Graphics();
        this.testCard.beginFill(0x996600).drawRect(0,0,100, 150).endFill();
       // stage.addChild(this.testCard)
    },
    addSlot: function (slot) {
        this.slots.push(slot);
    },
    onDragStart: function (e) {


        this.activeCard = e.target;
        let arr = this.parent.piles[this.activeCard.index];
       


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
        this.dragCont.dragging = false;
        this.dragCont.data = null;
        let tempArray = [...this.dragCont.children];
        tempArray.forEach( card => {
            card.x = card.storePos.x;
            card.y = card.storePos.y;
            card.storeParent.addChild(card)
        })
       
        this.activeCard = undefined;
        this.stage.removeChild(this.dragCont);
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

                //test if empty pile
                if (this.parent.piles[key].length === 0) {
                    let marker = this.parent.pileMarkers[key];
                    let markerPoint = marker.getGlobalPosition(new PIXI.Point(marker.x, marker.y))
                    let markerObject = {
                        x: markerPoint.x,
                        y: markerPoint.y,
                        width: marker.width,
                        height: marker.height
                    }
                    if ( 
                        UTILS.rectangleRectangleCollisionDetection(markerObject, activeCardObj)
                    ) {

                        let storeIndex = this.activeCard.index;
                       let temp = [...this.dragCont.children]
                       temp.forEach ( (card, index) => {
                            console.log(card.rank, card.suit)
                            card.x = marker.x;
                            card.y = marker.y + (index * (this.parent.buffer * 4));
                            this.parent.piles[card.index].splice(this.parent.piles[card.index].indexOf(card), 1)
                            this.parent.piles[key].push(card);
                            this.parent.container.addChild(card);
                            card.index = key;
                        })
                     
                        this.activeCard = undefined;
                        this.parent.revealNextCard(this.parent.piles[storeIndex])
                         break;
                    }
                   
                }

                //test for piles with cards
               let topCard = this.parent.piles[key][this.parent.piles[key].length - 1]
               
               if (!this.activeCard || !topCard || topCard === this.activeCard) continue;
               let tempPoint3 = topCard.getGlobalPosition(new PIXI.Point(topCard.x, topCard.y))
               let obj = {
                   x: tempPoint3.x,
                   y: tempPoint3.y,
                   width: topCard.width,
                   height: topCard.height
               }
         

                if ( 
                    topCard.color !== this.activeCard.color && 
                    topCard.rank === (this.activeCard.rank + 1) &&
                    UTILS.rectangleRectangleCollisionDetection(obj, activeCardObj)
                ) {
                    console.log('top card hit');

                    this.parent.switchCardPile(this.activeCard, topCard);
                    this.activeCard = undefined;
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