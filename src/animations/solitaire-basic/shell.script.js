import * as PIXI from 'pixi.js';
import VARS from './utils/Vars.class';
import SOLITARE from './Solitaire.class';
export default {
    init: function () {

        const app = new PIXI.Application({
            width: VARS.canvasWidth, height: VARS.canvasWidth, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("home-canvas").appendChild(app.view);
        app.ticker.add(this.ticker);
        this.app = app;

        this.solitaire = new SOLITARE(app);
        app.stage.addChild(this.solitaire.gameBoard);

    },
    destroy: function () {
        this.app.destroy();
    },
    ticker: function(delta) {

    }
}