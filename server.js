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
    let cardList = fs.readFileSync("./cardFiles/cards.json", "UTF-8");
    res.send(cardList);
});
app.post("/addCard", (req, res)=>{
    let cards = fs.readFileSync("./cardFiles/greenCards.json", "UTF-8")
    cards = JSON.parse(cards)
    cards[req.body.cardName.toLowerCase()] = parseInt(req.body.number);
    cards = JSON.stringify(cards);
    fs.writeFileSync("./cardFiles/greenCards.json", cards);
    res.send(cards)
})
app.put("/updateCard", (req, res)=>{
    let cards = fs.readFileSync("./cardFiles/greenCards.json", "UTF-8");
    let card = Object.keys(req.body)[0];
    cards = JSON.parse(cards);
    cards[card.toLowerCase()] = parseInt(req.body[card]);
    cards = JSON.stringify(cards);
    fs.writeFileSync("./cardFiles/greenCards.json", cards)
    res.send(cards)
})
app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})
