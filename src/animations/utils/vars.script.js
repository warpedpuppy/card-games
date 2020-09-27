import * as PIXI from 'pixi.js';

export default {
    cardWidth: 100,
    cardHeight: 150,
    canvasWidth: 1000,
    canvasHeight: 800,
    suits: ["clubs", "diamonds", "hearts", "spades"],
    rank: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    testVar: undefined,
    globalObject: function (item) {
       
        let activeCardGlobalPoint = item.getGlobalPosition(new PIXI.Point(item.x, item.y))

        return {
            x: activeCardGlobalPoint.x,
            y: activeCardGlobalPoint.y,
            width: this.cardWidth,
            height: this.cardHeight
        }
    },
    setTest: function (value) {
        this.testVar = value;
    },
    getTest: function () {
        console.log("test value = ", this.testVar)
    }
}