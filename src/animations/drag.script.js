import * as PIXI from 'pixi.js';
import UTILS from '../utils/utils';
import VARS from './vars.script';
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

        let activeCardObj = VARS.globalObject(this.activeCard);
        console.log(activeCardObj)

         //SLOT CHECK

        let slotHitObject = this.slotHitListener(activeCardObj)
        let pileHitObject = this.movePileListener(activeCardObj)
         if (this.dragCont.children.length === 1 && slotHitObject.hit) {
                console.log(slotHitObject.hit)
                let slot = slotHitObject.slot;
                this.addCardToSlot(slot);
         } else if (pileHitObject.hit) {
             console.log('pile hit');
             this.movePiles(pileHitObject.topCard, pileHitObject.key);
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
    slotHitListener: function (activeCardObj) {
        for (let i = 0; i < 4; i ++) {
    
            let slotObj = VARS.globalObject(this.slots[i]); 

            if ( 
                UTILS.rectangleRectangleCollisionDetection(slotObj, activeCardObj) &&
                this.slots[i].rank === this.activeCard.rank &&
                this.slots[i].suit === this.activeCard.suit
            ) {
                return { hit: true, slot: this.slots[i]};
            }
        }
        return {hit: false, slot: undefined};
    },
    addCardToSlot: function (slot) {
        this.removeDrag(this.activeCard);
        let destinationParent = slot.parent;
        destinationParent.addChild(this.activeCard);
        this.activeCard.x = slot.x;
        this.activeCard.y = slot.y;
        this.parent.cardPlacedOnSlot(this.activeCard);
        slot.rank ++;
    },
    onDragMove: function (e) {

        if (this.activeCard && this.dragCont.dragging) {
            const newPosition = this.dragCont.data.getLocalPosition(this.dragCont.parent);
            this.dragCont.x = newPosition.x - this.dragCont.adjustX;
            this.dragCont.y = newPosition.y - this.dragCont.adjustY;
        }
    },
    movePileListener: function (activeCardObj) {
         //PILE TO PILE CHECK
         for (let key in this.parent.piles) {

           
            //test for piles with cards
           let topCard = this.parent.piles[key][this.parent.piles[key].length - 1]
           
           if (!this.activeCard || !topCard || topCard === this.activeCard) continue;

           let topCardObj = VARS.globalObject(topCard); 

            if ( 
                topCard.color !== this.activeCard.color && 
                topCard.rank === (this.activeCard.rank + 1) &&
                UTILS.rectangleRectangleCollisionDetection(topCardObj, activeCardObj)
            ) {
                console.log('top card hit');
                return {hit: true, topCard, key}
            
                
            } else if (topCard.marker) {
                return {hit: true, topCard, key}
                
            }
          
        }
        return {hit: false}
    },
    movePiles: function (topCard, key) {
        let storeIndex = this.activeCard.index;
        let temp = [...this.dragCont.children]
        temp.forEach ( (card, i) => {
            console.log(card.rank, card.suit)
            card.x = topCard.x;
            card.y = topCard.y + ((i + 1) * (this.parent.buffer * 4));
            this.parent.piles[card.index].splice(this.parent.piles[card.index].indexOf(card), 1)
            this.parent.piles[key].push(card);
            this.parent.container.addChild(card);
            card.index = key;
        })

       // this.activeCard = undefined;
        this.parent.revealNextCard(this.parent.piles[storeIndex])
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