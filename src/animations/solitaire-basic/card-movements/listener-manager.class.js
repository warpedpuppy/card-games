import DrawPileListeners from './DrawPileListeners.class';
import Drag from './Drag.class';

export default class ListenerManager {


    static root = undefined;

    static setRoot (root) {
        this.root = root;
        Drag.setRoot(root);
        DrawPileListeners.setRoot(root);
    }

    static removeAllListeners (item) {
        item.makeInteractive(false);
        item.removeAllListeners();
    }
    static addDrag (card) {
        Drag.addDrag(card)
       
    }
    static addFlip (card) {
        card.makeInteractive(true)
        card.on("click", DrawPileListeners.drawPileClickHandler.bind(DrawPileListeners));
        
    }
    static addResetFlip (button) {
        button.visible = true;
        button.interactive = button.buttonMode = true;
        button.on("click", DrawPileListeners.resetDrawPileHandler.bind(DrawPileListeners))
       
    }
    static removeResetFlip (button) {
        button.visible = false;
        button.interactive = false;
        button.buttonMode = false;
        button.removeAllListeners();
    }



}