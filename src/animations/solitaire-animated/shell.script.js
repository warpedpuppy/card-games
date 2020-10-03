import * as PIXI from 'pixi.js';
import Vars from './utils/Vars.class';
import Solitaire from './Solitaire.class';
import Tweening from './utils/Tweening.class';
import Drag from './card-movements/Drag.class';
import Background from './decorative-elements/Background.class';
import FishSchool from './decorative-elements/FishSchool.class';
import WaterRipples from './decorative-elements/WaterRipples.class';
export default class Shell {
    constructor () {

        const app = new PIXI.Application({
            width: Vars.canvasWidth, height: Vars.canvasWidth, backgroundColor: 0x3399ff, resolution: window.devicePixelRatio || 1,
        });

        document.getElementById("home-canvas").appendChild(app.view);
        app.ticker.add(this.ticker.bind(this));
        this.app = app;

        this.background = new Background();
        app.stage.addChild(this.background);

        this.fishSchool = new FishSchool();
        app.stage.addChild(this.fishSchool);

        this.waterRipples = new WaterRipples();
        app.stage.addChild(this.waterRipples);

        this.solitaire = new Solitaire(app);
        app.stage.addChild(this.solitaire.gameBoard);

    }
    destroy () {
        this.app.destroy();
    }
    ticker (delta) {
        Tweening.animate();
        Drag.animate();
        this.fishSchool.animate();
        this.background.animate();
        this.waterRipples.animate();
    }
}