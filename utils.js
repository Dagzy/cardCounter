const fs = require('fs')
let cards = fs.readFileSync("./cardObject.json", "UTF-8");
cards = JSON.parse(cards);
constructParent(cards)
constructArrays(cards)
cards = JSON.stringify(cards);
// fs.writeFileSync("./filteredCards.json", cards)

//Pretty sure this is all trash, but ya know, can't get rid of anything!
function constructParent(cardList) {
    //deprecated - worked when it needed to, might need it again, but doubt it
    for (const color in cardList) {
        if (color !== "cards") {
            console.log("working", cardList[color]);
            if (!(cardList[color] instanceof Array)) {
                for (const key in cardList[color]) {
                    cardList.cards[key] =
                    {
                        quantity: cardList[color][key],
                        foil: false,
                        saleValue: null,
                        colors: colorPalette(color)
                    }
                }
                delete cardList[color]
            }
        }
    }
}
function colorPalette(color) {
    //deprecated - kinda just bad code too
    let colors = [];
    switch (color) {
        case "artifactsAndArtifactCreatures":
            colors.push("colorless")
            break;
        case "blackCards":
            colors.push("black")
            break;
        case "greenCards":
            colors.push("green")
            break;
        case "goldCards":
            colors.push("gold")
            break;
        case "redCards":
            colors.push("red")
            break;
        case "whiteCards":
            colors.push("white")
            break;
        case "landCards":
            colors.push("land", "colorless")
            break;
        default:
            console.log("inside the switch!", color)
            break;
    }
    return colors
}
function constructArrays(cardList) {
    //deprecated as of gold card refactoring
    for (const card in cardList.cards) {
        let color = cardList.cards[card].colors[0]
        cardList[color].push(card)
    }
}