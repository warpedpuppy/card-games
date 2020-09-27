import * as PIXI from 'pixi.js';
import VARS from './utils/vars.script';
export default class Marker extends PIXI.Container {
    constructor () {
        super();
        let marker = new PIXI.Graphics();
        marker.marker = true;
        marker.beginFill(0x000000).drawRect(0,0,VARS.cardWidth, VARS.cardHeight).endFill();
        this.addChild(marker)
    }
}