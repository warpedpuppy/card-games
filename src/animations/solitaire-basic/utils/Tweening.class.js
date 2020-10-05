import Utils from './Utils.class.js';
import Easing from './Easing.class.js';
export default class Tweening {
  static allowTween = false;
  static fadeOutBoolean = false;
  static fadeInBoolean = false;
  static tweenArray = [];
  static defaultEasing = 'linear';
  static killAll () {
    const clone = (this.tweenArray) ? this.tweenArray.slice() : [] ;
    this.tweenArray.length = 0;

    clone.forEach((item, index) => {
      for (const property in item.obj) {
        const endValue = item.obj[property][1]
        item[property] = endValue
        clone.splice(index, 1)
        break
      }
    })
  }
  static tween (item, seconds, changePropertiesObject, onComplete, easing) {

    if (!item || item.isTweening) return;

    item.id = Utils.randomIntBetween(10, 20);

    item.seconds = seconds;
    item.onComplete = onComplete;
    item.easing = easing;
    item.startTime = new Date().getTime();
    item.obj = changePropertiesObject;
    item.isTweening = true;

    this.tweenArray.push(item)
  }
  static animate () {
    // console.log(this.tweenArray.length)
    if (this.tweenArray.length) {
      this.tweenArray.forEach((item, index) => {
        if (!item.obj) {
          item.isTweening = false
          if (item && item.onComplete) {
            try {
              item.onComplete()
            } catch (e) {
              // console.error(e)
            }
          }
          this.tweenArray.splice(index, 1)
        }
        for (const property in item.obj) {
          const t = new Date().getTime() - item.startTime
          const b = item.obj[property][0]
          const c = item.obj[property][1]
          const d = item.seconds * 1000
          const percentage = t / d
          const easing = (!item.easing) ? this.defaultEasing : item.easing
          const inc = Easing[easing](percentage)
          const inc2 = b + inc * (c - b)

          if (percentage < 1) {
            item[property] = inc2
          } else {
            item.obj = undefined
            break
          }
        }
      })
    }
  }

}