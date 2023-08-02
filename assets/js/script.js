gameData = []
let gameDiv = document.getElementById("game-div")
let startButton = document.getElementById("start-button")
let weapon;
let playerScore;
let aiScore;
let aiWeapon;
let player;

let startGame = () => {

    startButton.style.backgroundColor = "pink"
    fetchData("../assets/js/data.json")
}

startButton.addEventListener("click", startGame)

/**
 * fetch data from specified json file url
 */
let fetchData = url => {
    const data = fetch(url)
        .then(response => response.json())
        .then(data => {
            gameData = data
            showGame();
        })
}

let showGame = (bestOf = 3, noWeapons = 3) => {

    const html = document.createElement("div")
    for (let i = 0; i < noWeapons; i++) {
        html.innerHTML += `
            <div class="${gameData[i].name} selButton">
                <h2>${gameData[i].name}</h2>
            </div>
            `
    }
    html.id = "selection"
    gameDiv.appendChild(html)
    //add event listeners to all instances of selButton class
    let buttons = document.getElementsByClassName("selButton")
    for (let i of buttons) {
        i.addEventListener('click', () => {
            weapon = userWeapon(i.classList[0])
            confirm()
            console.log(`Weapon is ${weapon}`)
        })
    }
}

let computerMove = (noWeapons = 3) => {
    let i = Math.floor(Math.random() * noWeapons)
    aiWeapon = gameData[i].name;
    console.log(`AI weapon is ${aiWeapon}`);
    return aiWeapon;
}
/**
 * Returns user selected weapon
 */
let userWeapon = weapon => {
    console.log(`User weapon is ${weapon}`)
    return weapon
};

let confirm = () => {
    let confirmDiv = document.createElement("div");
    confirmDiv.innerHTML +=
        `
        <h1>You chose ${weapon}</h1>
        <h2>Are you absolutely sure??</h2>
        <div class = "confirm__yes">
            <h3>Yes</h3>
        </div>
        <div class = "confirm__no">
            <h3>No</h3>
        </div>
    `
    confirmDiv.classList.add("confirm")
    gameDiv.appendChild(confirmDiv)
    let confirm = document.getElementsByClassName("confirm")[0];
    let confirmNo = document.getElementsByClassName("confirm__no")[0];
    confirmNo.addEventListener("click", () => {
        gameDiv.removeChild(confirm)
    })

    let confirmYes = document.getElementsByClassName("confirm__yes")[0];
    confirmYes.addEventListener("click", () => {
        gamePlay();
    })
}

let playerWin = () => {
    let res
    if (aiWeapon === player.name) {
        res = "draw"
        return res
    }
    res = !player.weakness.includes(aiWeapon) ? "win" : "lose"
    return res
}

let displayWin = (res) => {
    let html = document.createElement("div")
    html.innerHTML = `
        <h1 class = "ai${res}">
            AI : ${aiWeapon}
        </h1>
        <h1 class = "player${res}">
            Player: ${player.name}
        </h1>`

    switch (res) {
        case "draw":
            html.innerHTML += `
            <h2>Let's try that again. You guys are eerily similar</h2>`
            break
        case "win":
            html.innerHTML +=
                `<h2>You win, you beautiful biscuit</h2>`
            break
        case "lose":
            html.innerHTML +=
                `<h2>Better luck next time, you silly sausage</h2>`
    }
    html.innerHTML += `
        <div class = "replay">
            <h3>Onwards...</h3>
        </div>
    `
    html.classList.add("winDisplay")
    // remove children of gameDiv
    while (gameDiv.firstChild) {
        gameDiv.removeChild(gameDiv.firstChild)
    }
    gameDiv.appendChild(html)
}

let gamePlay = () => {
    computerMove()
    player = gameData.find(w => weapon === w.name)
    displayWin(playerWin())
}