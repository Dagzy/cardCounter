'use strict';
const express = require("express"),
    router = express.Router(),
    fs = require("fs"),
    addGoldCard = require("../utils").goldCard,
    updateColorArrays = require("../utils").updateColorArrays;
router.get("/checkCards", (req, res) => {
    let cardList = fs.readFileSync("./filteredCards.json", "UTF-8");
    res.send(cardList);
});
router.post("/addCard", (req, res) => {
    let { cardName, quantity, foil, colors } = req.body;
    fs.readFile("./filteredCards.json", "UTF-8", (err, file) => {
        let sourceFile = JSON.parse(file),
            { filterArrays, cards } = sourceFile;

        cards[cardName.toLowerCase()] = { quantity: parseInt(quantity), foil: foil, saleValue: null, colors: colors }
        
        colors.length > 1 ? filterArrays = addGoldCard(filterArrays, colors, cardName.toLowerCase()) : filterArrays[colors[0]].includes(cardName) ? null : filterArrays[colors[0]].push(cardName.toLowerCase());

        sourceFile = JSON.stringify(sourceFile);
        fs.writeFile("./filteredCards.json", sourceFile, (err, file) => {
            if (err) {
                console.log(err)
            }
            res.send(sourceFile);
        });
    });
});
router.put("/updateCard", (req, res) => {
    fs.readFile("./filteredCards.json", "UTF-8", (err, file) => {
        let cards = JSON.parse(file),
            card = Object.keys(req.body)[0],
            { quantity, colors } = req.body[card],
            { filterArrays } = cards;

        req.body[card].quantity = parseInt(quantity)
        req.body[card].saleValue = null;
        cards.filterArrays = updateColorArrays(filterArrays, card);

        colors.length > 1 ? cards.filterArrays = addGoldCard(filterArrays, colors, card.toLowerCase()) : cards.filterArrays[colors[0]].push(card.toLowerCase());

        cards.cards[card.toLowerCase()] = req.body[card];

        cards = JSON.stringify(cards);

        fs.writeFile("./filteredCards.json", cards, () => {
            res.send(cards);
        })
    });
})
module.exports = router;

//mostly trash, but I wasted an hour on it, so I'll keep it for a minute.
// colors.includes(filters[filter]) && filters[filter].includes(card) ? null :
//     colors.includes(filters[filter]) && !filters[filter].includes(card) ? filters[filter].push(card) :
//         filters[filter].includes(card) && !colors.includes(filters[filter]) ? filters[filter].splice(filters[filter].indexOf(card), 1) : null