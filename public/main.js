const list = document.getElementById("card-list");
let cardList;
getCardListFromServer();
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
    let output = {};
    if (e.target.value) {
        let input = e.target.value
        for (const card in cardList) {
            if (card.includes(input.toLowerCase())) {
                output[card] = cardList[card]
            }
        }
    }
    drawCardList(output);
}
function drawCardList(cardList) {
    list.innerHTML = "";
    for (const card in cardList) {
        const item = document.createElement("li"),
            amount = document.createElement("input"),
            save = document.createElement("button");
        save.innerText = "Save";
        save.addEventListener("click", updateCard);
        save.id = card;
        amount.type = "number";
        amount.id = card + "-amount";
        amount
            .classList
            .add("colorful");
        save
            .classList
            .add("colorful");
        item.innerText = card;
        amount.value = cardList[card];
        item.appendChild(amount);
        item.appendChild(save)
        list.appendChild(item);
    }
}
function updateCard(e) {
    const cardAmount = document
            .getElementById(e.target.id + "-amount")
            .value,
        payload = {
            [e.target.id]: cardAmount
        }
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
function addCard(e) {
    const cardName = document.getElementById("card-name"),
        cardNumber = document.getElementById("new-card-number");
    if (cardName.value && cardNumber.value) {
        fetch("http://localhost:9001/addCard", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
                body: JSON.stringify({cardName: cardName.value, number: cardNumber.value})
            })
            .then(res => res.json())
            .then(data => {
                setCardList(data);
                reset();
            });

    }else{
        alert("Enter both fields")
    }
}
function reset() {
    const cardName = document.getElementById("card-name");
    cardName.value = "";
    cardName.focus();
    document
        .getElementById("new-card-number")
        .value = "";
    list.innerText = "";
}