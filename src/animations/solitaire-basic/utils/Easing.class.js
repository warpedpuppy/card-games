export default class Easing {
    // no easing, no acceleration
    static linear (t) { return t }
    // accelerating from zero velocity
    static easeInQuad(pos) {
      return Math.pow(pos, 2);
    }
  
    static easeOutQuad (pos) {
      return -(Math.pow((pos-1), 2) -1);
    }
  
    static easeInOutQuad (pos) {
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2);
      return -0.5 * ((pos-=2)*pos - 2);
    }
  
    static easeInCubic (pos) {
      return Math.pow(pos, 3);
    }
  
    static easeOutCubic (pos) {
      return (Math.pow((pos-1), 3) +1);
    }
  
    static easeInOutCubic (pos) {
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
      return 0.5 * (Math.pow((pos-2),3) + 2);
    }
  
    static easeInQuart (pos) {
      return Math.pow(pos, 4);
    }
  
    static easeOutQuart (pos) {
      return -(Math.pow((pos-1), 4) -1);
    }
  
    static easeInOutQuart (pos) {
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
      return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
    }
  
    static easeInQuint (pos) {
      return Math.pow(pos, 5);
    }
  
    static easeOutQuint (pos) {
      return (Math.pow((pos-1), 5) +1);
    }
  
    static easeInOutQuint (pos) {
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
      return 0.5 * (Math.pow((pos-2),5) + 2);
    }
  
    static easeInSine (pos) {
      return -Math.cos(pos * (Math.PI/2)) + 1;
    }
  
    static easeOutSine (pos) {
      return Math.sin(pos * (Math.PI/2));
    }
  
    static easeInOutSine (pos) {
      return (-0.5 * (Math.cos(Math.PI*pos) -1));
    }
  
    static easeInExpo (pos) {
      return (pos===0) ? 0 : Math.pow(2, 10 * (pos - 1));
    }
  
    static easeOutExpo (pos) {
      return (pos===1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    }
  
    static easeInOutExpo (pos) {
      if(pos===0) return 0;
      if(pos===1) return 1;
      if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
      return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    }
  
    static easeInCirc (pos) {
      return -(Math.sqrt(1 - (pos*pos)) - 1);
    }
  
    static easeOutCirc (pos) {
      return Math.sqrt(1 - Math.pow((pos-1), 2));
    }
  
    static easeInOutCirc (pos) {
      if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1);
      return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1);
    }
  
    static easeOutBounce (pos) {
      if ((pos) < (1/2.75)) {
        return (7.5625*pos*pos);
      } else if (pos < (2/2.75)) {
        return (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
      } else if (pos < (2.5/2.75)) {
        return (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
      } else {
        return (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
      }
    }
  
    static easeInBack (pos) {
      var s = 1.70158;
      return (pos)*pos*((s+1)*pos - s);
    }
  
    static easeOutBack (pos) {
      var s = 1.70158;
      return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
    }
  
    static easeInOutBack (pos) {
      var s = 1.70158;
      if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s));
      return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2);
    }
  
    static elastic (pos) {
      return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
    }
  
    static swingFromTo (pos) {
      var s = 1.70158;
      return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
      0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
    }
  
    static swingFrom (pos) {
      var s = 1.70158;
      return pos*pos*((s+1)*pos - s);
    } 
  
    static swingTo (pos) {
      var s = 1.70158;
      return (pos-=1)*pos*((s+1)*pos + s) + 1;
    }
  
    static bounce(pos) {
      if (pos < (1/2.75)) {
        return (7.5625*pos*pos);
      } else if (pos < (2/2.75)) {
        return (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
      } else if (pos < (2.5/2.75)) {
        return (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
      } else {
        return (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
      }
    }
  
    static bouncePast (pos) {
      if (pos < (1/2.75)) {
        return (7.5625*pos*pos);
      } else if (pos < (2/2.75)) {
        return 2 - (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
      } else if (pos < (2.5/2.75)) {
        return 2 - (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
      } else {
        return 2 - (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
      }
    }
  
    static easeFromTo (pos) {
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
      return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
    }
  
    static easeFrom (pos) {
      return Math.pow(pos,4);
    }
  
    static easeTo (pos) {
      return Math.pow(pos,0.25);
    }
  }
  