import * as PIXI from 'pixi.js';
import VARS from '../utils/Vars.class';

export default class Marker extends PIXI.Container {
    constructor () {
        super();
        let marker = new PIXI.Graphics();
        this.marker = true;
        marker.beginFill(0x000000).drawRect(0,0,VARS.cardWidth, VARS.cardHeight).endFill();
        this.addChild(marker)
    }
}