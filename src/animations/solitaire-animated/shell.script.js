import * as PIXI from 'pixi.js';
import Vars from './utils/Vars.class';
import Solitaire from './Solitaire.class';
import Tweening from './utils/Tweening.class';
import Drag from './card-movements/Drag.class';
export default {
    init: function () {

        const app = new PIXI.Application({
            width: Vars.canvasWidth, height: Vars.canvasWidth, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("home-canvas").appendChild(app.view);
        app.ticker.add(this.ticker);
        this.app = app;

        this.solitaire = new Solitaire(app);
        app.stage.addChild(this.solitaire.gameBoard);

    },
    destroy: function () {
        this.app.destroy();
    },
    ticker: function(delta) {
        Tweening.animate();
        Drag.animate();
    }
}