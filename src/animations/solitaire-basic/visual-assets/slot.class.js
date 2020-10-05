import * as PIXI from 'pixi.js';

export default class Slot extends PIXI.Container {
    constructor (suit) {
        super();
        console.log(suit)
        const graphics = new PIXI.Sprite(PIXI.Texture.from(`/bmps/slot${suit.charAt(0).toUpperCase()}${suit.substring(1, suit.length)}.png`));
        this.suit = suit;
        this.rank = 1;
        this.addChild(graphics)
    }
}