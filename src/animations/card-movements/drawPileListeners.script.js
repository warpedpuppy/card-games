import ROOT from '../solitaire.script';
import ListenerManager from "./listener-manager";
import VARS from '../utils/vars.script';
import TESTING from '../utils/testing.script';


export default class {
    static drawPileClickHandler (e) {

        let top3 = ROOT.drawPile.splice(-3).reverse(), card;

        TESTING.printDeck(top3)

        for (let i = 0; i < top3.length; i ++) {
            card  = top3[i];
            card.reveal(true);
            ListenerManager.removeAllListeners(card)
            ROOT.container.addChild(card)
            card.y += VARS.cardHeight + 20;
        }

        ROOT.flipPile = [...ROOT.flipPile, ...top3];

        ROOT.topFlipPileCard = card;
        ListenerManager.addDrag(ROOT.topFlipPileCard);

        if (ROOT.drawPile.length === 0) {
            ListenerManager.addResetFlip(ROOT.resetDrawPileButton); 
        } else {
            let topCard = ROOT.drawPile[ROOT.drawPile.length - 1];
            ListenerManager.addFlip(topCard);
        }
    
    }
    static resetDrawPileHandler (e) {

        ListenerManager.removeResetFlip(ROOT.resetDrawPileButton);

        ROOT.drawPile = [...ROOT.flipPile].reverse();
        let startY = VARS.cardHeight + (ROOT.buffer * 4);
        let c;
       
        ROOT.drawPile.forEach( card => {
            card.reveal(false);
            ListenerManager.removeAllListeners(card)
            card.x = 0;
            card.y = startY;
            startY += 1;
            ROOT.container.addChild(card);
            c = card;
        })
        TESTING.printDeck(ROOT.drawPile)
        ROOT.topDrawPileCard = c;
        ListenerManager.addFlip(ROOT.topDrawPileCard);
        ROOT.flipPile = [];
    }


}