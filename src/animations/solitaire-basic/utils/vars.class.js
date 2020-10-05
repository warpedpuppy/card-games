import * as PIXI from 'pixi.js';

export default class Vars {
    static cardWidth =  100;
    static cardHeight =  150;
    static canvasWidth =  1000;
    static canvasHeight =  800;
    static suits =  ["clubs", "diamonds", "hearts", "spades"];
    static rank =  ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    static animate = true;
    static globalObject(item) {
       
        let activeCardGlobalPoint = item.getGlobalPosition(new PIXI.Point(item.x, item.y))

        return {
            x: activeCardGlobalPoint.x,
            y:  activeCardGlobalPoint.y,
            width:  this.cardWidth,
            height:  this.cardHeight
        }
    }

}