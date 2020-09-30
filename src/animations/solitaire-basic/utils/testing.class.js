export default class Testing {
    
    static printDeck (arr) {
        let str = '';
        arr.forEach( card => {
            str += `${card.rank}, ${card.suit} | `
        })
        console.log(str)
    }
    static howManyListeners (arr) {
        let returnObj = {};
        arr.forEach( card => {
            if (card._eventsCount) {
                let coveredString = card.cover.visible ? `(draw pile card)` : `` ;
                if (!returnObj[card._eventsCount]) {
                    returnObj[card._eventsCount] = [`${card.rank} of ${card.suit} ${coveredString}`]
                } else {
                    returnObj[card._eventsCount].push(`${card.rank} of ${card.suit} ${coveredString}`)
                }
            } 
        })
        for (let key in returnObj) {
            console.log(key, returnObj[key])
        }
    }
    static beingCarried (arr) {
        console.log('\n the following cards are being carried:')
        arr.forEach( card => {
            console.log(`\tthe ${card.rank} of ${card.suit}`)
        })
    }
}