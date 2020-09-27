import * as PIXI from 'pixi.js';
import VARS from './utils/vars.script';
export default {
    vars: undefined,
    init: function (vars) {
        this.vars = vars;
    },
    build: function (suit) {
        let marker = new PIXI.Graphics();
        marker.marker = true;
        marker.beginFill(0x000000).drawRect(0,0,VARS.cardWidth, VARS.cardHeight).endFill();
        return marker;

    }
}