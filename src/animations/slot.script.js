import * as PIXI from 'pixi.js';
import VARS from './utils/vars.script';
export default {
    vars: undefined,
    init: function (vars) {
        this.vars = vars;
    },
    build: function (suit) {
            const container = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0x000000);
            graphics.drawRoundedRect(0, 0, VARS.cardWidth, VARS.cardHeight, 10);
            graphics.endFill();
            container.suit = suit;
            container.rank = 1;
            container.addChild(graphics)
            return container;
    }
}