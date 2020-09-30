import * as PIXI from 'pixi.js';
import VARS from '../utils/Vars.class';

export default class Slot extends PIXI.Container {
    constructor (suit) {
        super();
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRoundedRect(0, 0, VARS.cardWidth, VARS.cardHeight, 10);
        graphics.endFill();
        this.suit = suit;
        this.rank = 1;
        this.addChild(graphics)
    }
}