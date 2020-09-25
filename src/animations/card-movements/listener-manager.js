import DRAWPILE from './drawPile.script';
import DRAG from './drag.script';
export default class ListenerManager {

    static listenerTracker = [];

    addDrag (card) {
        DRAG.addDrag(card)
        this.listenerTracker.push(card)
    }
    removeDrag (card) {
        DRAG.remove(card)
        this.listenerTracker.splice(this.listenerTracker.indexOf(card), 1)
    }
    static addFlip (card) {
        card.makeInteractive(true)
        card.on("click", DRAWPILE.drawPileClickHandler.bind(DRAWPILE));
        this.listenerTracker.push(card);
    }
    static removeFlip () {

    }
    static addResetFlip (button) {
        button.visible = true;
        button.interactive = button.buttonMode = true;
        button.on("click", DRAWPILE.resetDrawPileHandler.bind(DRAWPILE))
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