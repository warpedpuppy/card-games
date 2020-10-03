
import Utils from '../utils/Utils.class';
import * as PIXI from 'pixi.js';
import Vars from '../utils/Vars.class';
export default class WaterRipples extends PIXI.Container {

    texture = '/bmps/waterSmall.png';
    sprite1 = undefined;
    sprite2 = undefined;
    speed1 = 0.5;
    speed2 =  0.75;
    sizeIncrement = 2;
    utils = Utils;
    gridIndex =  5;

    constructor () {
      super();
      
      this.wh = {canvasWidth: Vars.canvasWidth, canvasHeight: Vars.canvasHeight};

      this.cont = this.quadrupleSpriteSize(this.texture)// this.build(arr);
      this.cont2 = this.quadrupleSpriteSize(this.texture)// this.build(arr);

      this.cont.width = this.wh.canvasWidth * this.sizeIncrement
      this.cont.height = this.wh.canvasHeight * this.sizeIncrement

      this.cont.vx = this.speed1
      this.cont.vy = this.speed1
      this.cont.alpha = 0.15

      this.cont2.width = this.wh.canvasWidth * this.sizeIncrement
      this.cont2.height = this.wh.canvasHeight * this.sizeIncrement
      this.cont2.x = -this.wh.canvasWidth / this.sizeIncrement
      this.cont2.y = -this.wh.canvasHeight / this.sizeIncrement
      this.cont2.alpha = 0.5
      this.cont2.vx = this.speed2
      this.cont2.vy = this.speed2

      this.addChild(this.cont);
      this.addChild(this.cont2)

    }
    quadrupleSpriteSize (texture) {
        // texture should be 1000x500
        const arr = [[0, 0, 1, 1],[2000, 0, -1, 1],[0, 1000, 1, -1],[2000, 1000, -1, -1]],
              cont = new PIXI.Container(),
              t = PIXI.Texture.from(texture);
        let s; 
        for (let i = 0; i < 4; i++) {
          s = new PIXI.Sprite(t)
          s.x = arr[i][0]
          s.y = arr[i][1]
          s.scale.x = arr[i][2]
          s.scale.y = arr[i][3]
          cont.addChild(s)
        }
        return cont
    }
    animate () {

      this.cont2.x += this.cont2.vx
      this.cont2.y += this.cont2.vy

      if (this.cont2.x > 0) {
        this.cont2.x = 0
        this.cont2.vx *= -1
      } else if (this.cont2.x < -this.wh.canvasWidth / this.sizeIncrement) {
        this.cont2.x = -this.wh.canvasWidth / this.sizeIncrement
        this.cont2.vx *= -1
      }

      if (this.cont2.y > 0) {
        this.cont2.y = 0
        this.cont2.vy *= -1
      } else if (this.cont2.y < -this.wh.canvasHeight / this.sizeIncrement) {
        this.cont2.y = -this.wh.canvasHeight / this.sizeIncrement
        this.cont2.vy *= -1
      }

      this.cont.x += this.cont.vx
      this.cont.y += this.cont.vy

      if (this.cont.x > 0) {
        this.cont.x = 0
        this.cont.vx *= -1
      } else if (this.cont.x < -this.wh.canvasWidth / this.sizeIncrement) {
        this.cont.x = -this.wh.canvasWidth / this.sizeIncrement
        this.cont.vx *= -1
      }

      if (this.cont.y > 0) {
        this.cont.y = 0
        this.cont.vy *= -1
      } else if (this.cont.y < -this.wh.canvasHeight / this.sizeIncrement) {
        this.cont.y = -this.wh.canvasHeight / this.sizeIncrement
        this.cont.vy *= -1
      }
    }
}
