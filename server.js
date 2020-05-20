const express = require("express"),
bodyParser = require("body-parser"),
app = express(),
port = 9001,
fs = require("fs");
app.use(bodyParser());
app.use(express.static("public"));
app.get(("/"), (req, res)=>{
    res.send("./public/index.html")
});
app.get("/checkCards", (req, res)=>{
    let cardList = fs.readFileSync("./filteredCards.json", "UTF-8");
    res.send(cardList);
});
app.post("/addCard", (req, res)=>{
    console.log(req.body);
    let {cardName, quantity, foil, colors} = req.body;
    let cards = fs.readFileSync("./filteredCards.json", "UTF-8");
    cards = JSON.parse(cards);
    cards.cards[cardName.toLowerCase()] = {quantity:Number(quantity), foil:foil, saleValue: null, colors: colors}
    cards = JSON.stringify(cards);
    fs.writeFileSync("./filteredCards.json", cards);
    res.send(cards);
})
app.put("/updateCard", (req, res)=>{
    console.log(req.body);    
    let cards = fs.readFileSync("./filteredCards.json", "UTF-8");
    let card = Object.keys(req.body)[0];
    cards = JSON.parse(cards);
    console.log(card);
    req.body[card].saleValue = null;
    cards[card.toLowerCase()] = req.body[card];
    cards = JSON.stringify(cards);
    fs.writeFileSync("./testFile.json", cards)
    res.send(cards);
})
app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
});