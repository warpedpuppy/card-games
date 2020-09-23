import * as PIXI from 'pixi.js';
export default {
    vars: undefined,
    init: function (vars) {
        this.vars = vars;
    },
    build: function (suit) {
        let marker = new PIXI.Graphics();
        marker.marker = true;
        marker.beginFill(0x000000).drawRect(0,0,this.vars.cardWidth, this.vars.cardHeight).endFill();
        return marker;

    }
}