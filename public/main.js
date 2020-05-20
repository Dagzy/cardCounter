const list = document.getElementById("card-list");
let cardList;
let filteredCards = {};
let filters = [];
let filteredList = [];
getCardListFromServer();
Array.from(document.getElementsByClassName("filter")).forEach(e => {
    e.addEventListener("change", setFilter)
});
function getCardListFromServer() {
    fetch("http://localhost:9001/checkCards")
        .then(res => res.json())
        .then(data => {
            setCardList(data);
        })
}
function setCardList(obj) {
    cardList = obj;
}
function searchList(e) {
    document.getElementById("filter-list").classList.add("hidden");
    let output = {};
    if (e.target.value) {
        let input = e.target.value;
        if (filters.length > 0) {
            for (const card in filteredCards) {
                if (card.includes(input.toLowerCase())) {
                    output[card] = filteredCards[card];
                }
            }
        } else {
            for (const card in cardList.cards) {
                if (card.includes(input.toLowerCase())) {
                    output[card] = cardList.cards[card];
                }
            }
        }
    }
    drawCardList(output);
}
function drawCardList(cards) {
    list.innerHTML = "";
    for (const card in cards) {
        const item = document.createElement("li"),
            amount = document.createElement("input"),
            save = document.createElement("input"),
            foil = document.createElement("input"),
            foilLabel = document.createElement("label");
        foil.type = "checkbox";
        foil.checked = cards[card].foil;
        foil.id = card + "-foil"
        foilLabel.innerText = "Foil";
        save.type = "submit"
        save.value = "Save";
        save.addEventListener("click", updateCard);
        save.id = card;
        amount.type = "number";
        amount.id = card + "-amount";
        amount
            .classList
            .add("quantity");
        save
            .classList
            .add("colorful");
        item.innerText = card;
        amount.value = cards[card].quantity;
        item.appendChild(amount);
        item.appendChild(foilLabel);
        item.appendChild(foil);        
        item.appendChild(makePalette(card, cards[card].colors))
        item.appendChild(save);
        item.classList.add("card-item")
        list.appendChild(item);
    }
}
function makePalette(cardName, colors) {
    const palette = ["black", "blue", "colorless", "green", "land", "red", "white"];
    let container = document.createElement("div");
    palette.forEach(color => {
        let div = document.createElement("div");
        let label = document.createElement("label");
        label.innerText = color;
        let box = document.createElement("input");
        box.type = "checkbox";
        box.classList.add("update-color");
        box.dataset.color = color;
        box.dataset.card = cardName;
        box.addEventListener("change", updateColors)
        if (colors.includes(color)) {
            box.checked = true;
        }
        div.appendChild(label);
        div.appendChild(box);
        container.classList.add("inline")
        container.appendChild(div);
    })
    return container;
}
function addCard(e) {
    const cardName = document.getElementById("card-name").value,
          cardNumber = document.getElementById("new-card-number").value,
          cardFoil = document.getElementById("new-card-foil").checked,
          cardColors = Array.from(document.getElementsByClassName("color-palette")).filter( cardColor => cardColor.checked).map(color => color.id)
    if (cardName && cardNumber) {
        let payload = { 
            cardName: cardName, 
            quantity: cardNumber, 
            foil: cardFoil, 
            colors: cardColors 
        }
        fetch("http://localhost:9001/addCard", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                setCardList(data);
                reset();
            });
    } else {
        alert("Fields need to be filled in")
    }
}
function updateCard(e) {
    const cardAmount = document.getElementById(e.target.id + "-amount").value,
          cardFoil = document.getElementById(e.target.id + "-foil").checked,
          cardColors = Array.from(document.querySelectorAll(`[data-card='${e.target.id}']`)).filter(el => el.checked ? true : false).map(el => el.dataset.color),
          payload = {
              [e.target.id]: {
                  quantity: cardAmount,
                  foil: cardFoil,
                  colors: cardColors
              }
          }
          console.log(cardColors);
          
    fetch("http://localhost:9001/updateCard", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            setCardList(data);
            reset();
        })
}
function reset() {
    const cardName = document.getElementById("card-name");
    cardName.value = "";
    cardName.focus();
    document.getElementById("new-card-number").value = "";
    Array.from(document.getElementsByClassName("reset")).map( element =>{
        element.checked = false;
    });
    list.innerText = "";
}
function showFilters() {
    let theList = document.getElementById("filter-list");
    theList.classList.contains("hidden") ? theList.classList.remove("hidden") : theList.classList.add("hidden")
}
function setFilter(e) {
    let filter = e.target.id.slice(0, -7)
    filters.indexOf(filter) !== -1 ? filters.splice(filters.indexOf(filter), 1) : filters.push(filter);
    reset();
    filteredList = [];
    filteredCards = {};
    filters.map((filter)=>{
        filteredList = [...filteredList, ...cardList[filter]];
    });
    filteredList.map((card)=>{
        filteredCards[card] = cardList.cards[card];
    });
}
function updateColors(e){
    console.log(e.target);
    
}