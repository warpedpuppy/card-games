export default {
    printDeck: function(arr) {
        let str = '';
        arr.forEach( card => {
            str += `${card.rank}, ${card.suit} | `
        })
        console.log(str)
    },
    howManyListeners: function (arr) {
        arr.forEach( card => {
            if (card._eventsCount) {
                console.log('card', card.suit, card.rank, card._eventsCount, card)
            } 
        })
    }
}