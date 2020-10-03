import * as PIXI from 'pixi.js';
import Utils from '../utils/Utils.class';
import Vars from '../utils/Vars.class';

export default class Background extends PIXI.Container {
        circles = [];
        constructor () {
            super();
            let t = PIXI.Texture.from('/bmps/circle.png');
            for (let i = 0; i < 100; i ++) {
                let s = new PIXI.Sprite(t);
                s.pivot.set(0.5);
                s.anchor.set(0.5)
                s.x = Utils.randomNumberBetween(0, Vars.canvasWidth);
                s.y = Utils.randomNumberBetween(0, Vars.canvasHeight);
                s.vx = Utils.randomNumberBetween(0.25, 1);
                s.vy = Utils.randomNumberBetween(1,2);
                s.tint = Utils.randomColor()
                s.alpha = Utils.randomNumberBetween(0.15, 0.75);
                if(Utils.randomNumberBetween(0,10) < 5) {
                    s.vx *= -1;
                }
                if(Utils.randomNumberBetween(0,10) < 5) {
                    s.vy *= -1;
                }
                s.scale.set(Utils.randomNumberBetween(0.15, 0.75))
                this.circles.push(s);
                this.addChild(s);

            }
        }
        animate () {
            this.circles.forEach( circle => {
                circle.x += circle.vx;
                circle.y += circle.vy;
                if (circle.x > Vars.canvasWidth || circle.x < 0) {
                    circle.vx *= -1;
                } else if (circle.y > Vars.canvasHeight || circle.y < 0) {
                    circle.vy *= -1;
                } 
            })
        }






}