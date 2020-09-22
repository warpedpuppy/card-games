export default {
    printDeck: function(arr) {
        let str = '';
        arr.forEach( card => {
            str += `${card.rank}, ${card.suit} | `
        })
        console.log(str)
    }
}