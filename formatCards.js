const {readFile, writeFile} = require("fs");

readFile("./filteredCards.json", "utf8", (err,data)=>{
    const {cards} = JSON.parse(data)
    console.log(cards);
    const output = [];
    for (const card in cards) {
        const c = {
            Name:card,
            ...cards[card]
        }
        output.push(c)
    }
    const toWrite = JSON.stringify(output)
    writeFile("./formattedCards.json", toWrite, (err, data)=>{
        console.log(err, data);
    })
})