import DRAWPILELISTENERS from './drawPileListeners.script';
import DRAG from './drag.script';
export default class ListenerManager {

    static listenerTracker = [];

    static removeAllListeners (item) {
        while (this.listenerTracker.indexOf(item) !== -1) {
            this.listenerTracker.splice(this.listenerTracker.indexOf(item), 1);
        }
        item.removeAllListeners();
    }
    static addDrag (card) {
        DRAG.addDrag(card)
        this.listenerTracker.push(card)
    }
    static removeDrag (card) {
        DRAG.remove(card)
        this.listenerTracker.splice(this.listenerTracker.indexOf(card), 1)
    }
    static addFlip (card) {
        card.makeInteractive(true)
        card.on("click", DRAWPILELISTENERS.drawPileClickHandler.bind(DRAWPILELISTENERS));
        this.listenerTracker.push(card);
    }
    static removeFlip () {

    }
    static addResetFlip (button) {
        button.visible = true;
        button.interactive = button.buttonMode = true;
        button.on("click", DRAWPILELISTENERS.resetDrawPileHandler.bind(DRAWPILELISTENERS))
        this.listenerTracker.push(button);
    }
    static removeResetFlip (button) {
        button.visible = false;
        button.interactive = false;
        button.buttonMode = false;
        button.removeAllListeners();
        this.listenerTracker.splice(this.listenerTracker.indexOf(button), 1)
    }



}