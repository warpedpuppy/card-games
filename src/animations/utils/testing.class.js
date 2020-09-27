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
            if (!card.interactive) {
                console.log('no listener')
            } else {
                console.log('listener')
            }
        })
    }
}