import * as PIXI from 'pixi.js';
import DECK from './deck.script';
import VARS from './utils/vars.script';
import TESTING from './utils/testing.script';
import SOLITARE from './solitaire.script';
import CARD from './card.class';
export default {
    init: function () {

        const app = new PIXI.Application({
            width: VARS.canvasWidth, height: VARS.canvasWidth, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.getElementById("home-canvas").appendChild(app.view);
        app.ticker.add(this.ticker);

        DECK.init(VARS);  
        DECK.createDeck();
        this.solitaire = new SOLITARE(app);
        app.stage.addChild(this.solitaire.gameBoard);


       
    },
    ticker: function(delta) {

    }
}