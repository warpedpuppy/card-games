import Utils from '../utils/Utils.class';
import Vars from '../utils/Vars.class';
import * as PIXI from 'pixi.js';

export default class FishSchool extends PIXI.Container {

    points = [];
    sharkPoints = [];
    imageWidth = 300;
    pointQ = 5;
    fishQ = 30;
    fishArray = [];
    sharkArray = [];
    sharkCont = new PIXI.Container();
    fishCont = new PIXI.Container();
    sharkQ = 20;
    buffer = 10;
    constructor (cont) {
    super();
      this.cont = cont
      this.wh = {canvasWidth: Vars.canvasWidth, canvasHeight: Vars.canvasHeight};
      this.fish = this.fish.bind(this)
      const steps = this.imageWidth / this.pointQ
      this.texture = PIXI.Texture.from('/bmps/koi.png')
      this.sharkTexture = PIXI.Texture.from('/bmps/shark.png')
      for (let i = 0; i < this.pointQ; i++) {
        this.points.push({ x: i * steps, y: 0 })
        this.sharkPoints.push({ x: i * steps, y: 0 })
      }

      for (let i = 0; i < this.fishQ; i++) {
        const f = this.fish(this.texture, this.points, Utils)
        f.x = Utils.randomNumberBetween(0, this.wh.canvasWidth)
        f.y = Utils.randomNumberBetween(0, this.wh.canvasHeight)
        f.vx = Utils.randomNumberBetween(-3, 3)
        f.vy = Utils.randomNumberBetween(-3, 3)
        f.alpha = 0.5
        f.rotation = Math.atan2(f.vy, f.vx)
        this.fishArray.push(f)
        this.fishCont.addChild(f)
      }

      for (let i = 0; i < this.sharkQ; i++) {
        const f = this.fish(this.sharkTexture, this.sharkPoints, Utils)
        f.x = Utils.randomNumberBetween(0, this.wh.canvasWidth)
        f.y = Utils.randomNumberBetween(0, this.wh.canvasHeight)
        f.vx = Utils.randomNumberBetween(-3, 3)
        f.vy = Utils.randomNumberBetween(-3, 3)
        f.alpha = 0.25
        f.rotation = Math.atan2(f.vy, f.vx)
        f.scale.set(Utils.randomNumberBetween(3, 5))
        this.fishArray.push(f)
        this.sharkCont.addChild(f)
      }

      this.loopingQ = this.fishQ + this.sharkQ

      this.addChild(this.fishCont)
      this.addChildAt(this.sharkCont, 0)
    }
    fish (texture, points) {
      const stripCont = new PIXI.Container();
      stripCont.pivot.set(0.5)
      const strip = this.strip = new PIXI.SimpleRope(texture, points)
      stripCont.addChild(strip)
      return stripCont
    }
    animate () {
      this.points[0].y = Utils.cosWave(0, 40, 0.01)
      this.points[3].y = Utils.cosWave(0, -3, 0.01)
      this.sharkPoints[0].y = Utils.cosWave(0, 40, 0.001)
      this.sharkPoints[3].y = Utils.cosWave(0, -3, 0.001)

      for (let i = 0; i < this.loopingQ; i++) {
        const f = this.fishArray[i]
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < -f.width - this.buffer) {
          f.x += this.buffer
          f.vx *= -1
          f.vy *= -1
          f.rotation = Math.atan2(f.vy, f.vx)
        } else if (f.x > Vars.canvasWidth + f.width + this.buffer) {
          f.x -= this.buffer
          f.vx *= -1
          f.vy *= -1
          f.rotation = Math.atan2(f.vy, f.vx)
        }

        if (f.y < -f.width - this.buffer) {
          f.y += this.buffer
          f.vx *= -1
          f.vy *= -1
          f.rotation = Math.atan2(f.vy, f.vx)
        } else if (f.y > Vars.canvasHeight + f.width + this.buffer) {
          f.y -= this.buffer
          f.vx *= -1
          f.vy *= -1
          f.rotation = Math.atan2(f.vy, f.vx)
        }
      }
    }


}
