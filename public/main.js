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
            setFilter();
        })
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
function drawCardList(cards) {
    list.innerHTML = "";
    for (const card in cards) {
        const itemParams = {
            text: card,
            amount: createCardQuantityElement(card, cards[card]),
            foil: createCardFoilElement(card, cards[card]),
            colors: makePalette(card, cards[card].colors),
            saveBtn: createSaveButtonElement(card),
            deleteBtn: createDeleteButtonElement(card)
        },
            item = createItem(itemParams)
        list.appendChild(item);
    }
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
    const { filterArrays } = cardList;
    if (e) {
        let filter = e
            .target
            .id
            .slice(0, -7)
        filters.indexOf(filter) !== -1
            ? filters.splice(filters.indexOf(filter), 1)
            : filters.push(filter);
    }
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
        box.addEventListener("focus", (e)=>{
            e.target.parentElement.classList.add("focused")
        })
        box.addEventListener("blur", (e)=>{
            e.target.parentElement.classList.remove("focused")
        })
        div.appendChild(label);
        div.appendChild(box);
        container
            .classList
            .add("inline");
        container.appendChild(div);
    })
    return container;
}
function createCardQuantityElement(card, props) {
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.id = `${card}-amount`;
    quantity
        .classList
        .add("quantity");
    quantity.value = props.quantity;
    return quantity
}
function createCardFoilElement(cardName, card) {
    let foil = document.createElement("input"),
        label = createFoilLabelElement(),
        container = document.createElement("div"),
        styleContainer = document.createElement("div");
    foil.type = "checkbox";
    foil.checked = card.foil;
    foil.id = cardName + "-foil";
    foil.addEventListener("focus", (e)=>{
        e.target.parentElement.classList.add("focused")
    });
    foil.addEventListener("blur", (e)=>{
        e.target.parentElement.classList.remove("focused")
    });
    container.appendChild(label);
    container.appendChild(foil);
    styleContainer.classList.add("inline")
    styleContainer.appendChild(container);
    return styleContainer;
}
function createFoilLabelElement() {
    let foilLabel = document.createElement("label");
    foilLabel.innerText = "Foil";
    return foilLabel;
}
function createSaveButtonElement(card) {
    const save = document.createElement("input");
    save.type = "button";
    save.value = "Save";
    save.addEventListener("click", updateCard);
    save.id = card;
    save
        .classList
        .add("btn");
    return save;
}
function createDeleteButtonElement(card) {
    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.dataset.cardName = card;
    deleteButton.addEventListener("click", deleteCard)
    deleteButton.classList.add("btn");
    return deleteButton;
}
function createItem(cardProps) {
    const { text, amount, foil, colors, saveBtn, deleteBtn } = cardProps;
    const item = document.createElement("li");
    item
        .classList
        .add("card-item")
    item.innerText = text;
    item.appendChild(amount);
    item.appendChild(foil);
    item.appendChild(colors)
    item.appendChild(saveBtn);
    item.appendChild(deleteBtn);

    return item;
}
function deleteCard(e) {
    let { cardName } = e.target.dataset,
        payload = {cardName: cardName};    
    fetch(`http://localhost:9001/cardRoute/deleteCard/${cardName}`, {
        method: "delete",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            setCardList(data)
            reset();
        });
}