'use strict';
const list = document.getElementById("card-list");
let cardList;
let filteredCards = {};
let filters = [];
let filteredList = [];
getCardListFromServer();
Array
    .from(document.getElementsByClassName("filter"))
    .forEach(e => {
        e.addEventListener("change", setFilter)
    });
function getCardListFromServer() {
    fetch("http://localhost:9001/cardRoute/checkCards")
        .then(res => res.json())
        .then(data => {
            setCardList(data);
        });
}
function setCardList(obj) {
    cardList = obj;
}
function searchList(e) {
    document
        .getElementById("filter-list")
        .classList
        .add("hidden");
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
function createCardQuantityElement(card, props){
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.id = `${card}-amount`;
    quantity
    .classList
    .add("quantity");
    quantity.value = props.quantity;
    return quantity
}
function createCardFoilElement(cardName, card){
    let foil = document.createElement("input");
    foil.type = "checkbox";
    foil.checked = card.foil;
    foil.id = cardName + "-foil"
    return foil;
}
function createFoilLabelElement(){
    let foilLabel = document.createElement("label");
    foilLabel.innerText = "Foil";
    return foilLabel;
}
function createSaveButtonElement(card){
    const save = document.createElement("input");
    save.type = "submit"
    save.value = "Save";
    save.addEventListener("click", updateCard);
    save.id = card;
    save
    .classList
    .add("colorful");
    return save;
}
function createItem(cardProps){
    const {text, amount, foilLabel, foil, colors, save} = cardProps;
    const item = document.createElement("li");
    item
    .classList
    .add("card-item")
    item.innerText = text;
    item.appendChild(amount);
    item.appendChild(foilLabel);
    item.appendChild(foil);
    item.appendChild(colors)
    item.appendChild(save);

    return item;
}
function drawCardList(cards) {
    list.innerHTML = "";
    for (const card in cards) {
        const itemParams = {
                text : card,
                amount : createCardQuantityElement(card, cards[card]),
                foilLabel : createFoilLabelElement(),
                foil : createCardFoilElement(card, cards[card]),
                colors : makePalette(card, cards[card].colors),
                save : createSaveButtonElement(card)
            },
            item = createItem(itemParams)
        list.appendChild(item);
    }
}
function makeItem(...props){
    const item = document.createElement("li");
    for (const props in props) {
        
    }

}
function makePalette(cardName, colors) {
    const palette = [
        "black",
        "blue",
        "colorless",
        "green",
        "land",
        "red",
        "white"
    ];
    let container = document.createElement("div");
    palette.forEach(color => {
        let div = document.createElement("div");
        let label = document.createElement("label");
        label.innerText = color;
        let box = document.createElement("input");
        box.type = "checkbox";
        box
            .classList
            .add("update-color");
        box.dataset.color = color;
        box.dataset.card = cardName;
        if (colors.includes(color)) {
            box.checked = true;
        }
        div.appendChild(label);
        div.appendChild(box);
        container
            .classList
            .add("inline");
        container.appendChild(div);
    })
    return container;
}
function addCard(e) {
    const cardName = document
        .getElementById("card-name")
        .value,
        cardNumber = document
            .getElementById("new-card-number")
            .value,
        cardFoil = document
            .getElementById("new-card-foil")
            .checked,
        cardColors = Array
            .from(document.getElementsByClassName("color-palette"))
            .filter(cardColor => cardColor.checked)
            .map(color => color.id)
    if (cardName && cardNumber) {
        let payload = {
            cardName: cardName,
            quantity: cardNumber,
            foil: cardFoil,
            colors: cardColors
        }
        fetch("http://localhost:9001/cardRoute/addCard", {
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
    const cardAmount = document
        .getElementById(e.target.id + "-amount")
        .value,
        cardFoil = document
            .getElementById(e.target.id + "-foil")
            .checked,
        cardColors = Array
            .from(document.querySelectorAll(`[data-card='${e.target.id}']`))
            .filter(el => el.checked)
            .map(el => el.dataset.color),
        payload = {
            [e.target.id]: {
                quantity: cardAmount,
                foil: cardFoil,
                colors: cardColors
            }
        }
    fetch("http://localhost:9001/cardRoute/updateCard", {
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
    document
        .getElementById("new-card-number")
        .value = "";
    Array
        .from(document.getElementsByClassName("reset"))
        .map(element => {
            element.checked = false;
        });
    list.innerText = "";
}
function showFilters() {
    let theList = document.getElementById("filter-list");
    theList
        .classList
        .contains("hidden")
        ? theList
            .classList
            .remove("hidden")
        : theList
            .classList
            .add("hidden")
}
function setFilter(e) {
    let filter = e
        .target
        .id
        .slice(0, -7),
        { filterArrays } = cardList;
    filters.indexOf(filter) !== -1
        ? filters.splice(filters.indexOf(filter), 1)
        : filters.push(filter);
    reset();
    filteredList = [];
    filteredCards = {};
    filters.map((filter) => {
        filteredList = [
            ...filteredList,
            ...filterArrays[filter]
        ];
    });
    filteredList.map((card) => {
        filteredCards[card] = cardList.cards[card];
    });
}