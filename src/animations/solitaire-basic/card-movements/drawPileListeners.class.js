import ListenerManager from "./Listener-Manager.class";
import Vars from '../utils/Vars.class';
import Testing from '../utils/Testing.class';
import Tweening from '../utils/Tweening.class';

export default class {
    root = undefined;
    static setRoot (root) {
        this.root = root;
    }
    static drawPileClickHandler (e) {


        let top3 = this.root.drawPile.splice(-3).reverse(), 
            card;

        Testing.printDeck(top3)

        for (let i = 0; i < top3.length; i ++) {
            card = top3[i];
            card.reveal(true);
            ListenerManager.removeAllListeners(card);
            this.root.gameBoard.addChild(card);

            if (!Vars.animate) {
                card.y += Vars.cardHeight + 20;
            } else {
                let newY = card.y + Vars.cardHeight + 50;
                card.makeInteractive(false);
                let timing = 0.5 * (0.5 * (i+1))
                console.log(card, timing, card.y, newY);
                Tweening.tween(card, timing, {y: [card.y, newY]}, this.completeMove.bind(card, i), 'bounce')
            }
            
        }

        this.root.flipPile = [...this.root.flipPile, ...top3];
        this.root.topFlipPileCard = card;
        ListenerManager.addDrag(this.root.topFlipPileCard);
        if (this.root.drawPile.length === 0) {
            
            ListenerManager.addResetFlip(this.root.resetDrawPileButton); 
        } else {
            let topCard = this.root.drawPile[this.root.drawPile.length - 1];
            ListenerManager.addFlip(topCard);
        }

       Testing.howManyListeners(this.root.flipPile);
    
    }
    static completeMove (card, i) {
        console.log("COMPLETE")
        if (i === 0)card.makeInteractive(true)
    }
    static resetDrawPileHandler (e) {

        ListenerManager.removeResetFlip(this.root.resetDrawPileButton);
        this.root.drawPile = [...this.root.flipPile].reverse();
        let startY = Vars.cardHeight + (this.root.buffer * 4), c;
        this.root.createDrawPile(startY, this.root.drawPile, false);
        this.root.flipPile = [];
    }


}