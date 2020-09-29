import DrawPileListeners from './drawPileListeners.class';
import Drag from './drag.class';

export default class ListenerManager {

    static listenerTracker = [];

    static root = undefined;

    static setRoot (root) {
        this.root = root;
        Drag.setRoot(root);
        DrawPileListeners.setRoot(root);
    }

    static removeAllListeners (item) {
        item.makeInteractive(false);
        while (this.listenerTracker.indexOf(item) !== -1) {
            this.listenerTracker.splice(this.listenerTracker.indexOf(item), 1);
        }
        item.removeAllListeners();
    }
    static addDrag (card) {
        Drag.addDrag(card)
        this.listenerTracker.push(card)
    }
    static addFlip (card) {
        card.makeInteractive(true)
        card.on("click", DrawPileListeners.drawPileClickHandler.bind(DrawPileListeners));
        this.listenerTracker.push(card);
    }
    static addResetFlip (button) {
        button.visible = true;
        button.interactive = button.buttonMode = true;
        button.on("click", DrawPileListeners.resetDrawPileHandler.bind(DrawPileListeners))
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