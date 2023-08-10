gameData = []
let gameDiv = document.getElementById("game-div")
let startButton = document.getElementById("start-button")
let scoreDiv = document.getElementById("score-div")
let noWeaponsButton = document.getElementById("no-weapons")
let weapon
let playerScore
let aiScore
let aiWeapon
let player
let bestOf
let noWeapons = 3
let gameIconsDiv = document.getElementById("game-icons")

/**
 * Sets variables to 0 and runs game etc etc 
 */
let startGame = () => {
  clearGame(gameDiv)
  startButton.style.backgroundColor = "pink"
  fetchData("assets/js/data.json")

  playerScore = aiScore = roundNo = 0

}

startButton.addEventListener("click", startGame)
//get number of weapons
noWeaponsButton.addEventListener("change", () => {
  noWeapons = document.getElementById("no-weapons").value
  console.log(`no weapons: ${noWeapons}`)
})

/**
 * fetch data from specified json file url
 */
let fetchData = url => {
  const data = fetch(url)
    .then(response => response.json())
    .then(data => {
      gameData = data
      showGame()
    })
}

/**
 * Sets up game div with event listeners
 */
let showGame = () => {
  displayIcons()
  let html = document.createElement("div")
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
  for (let button of buttons) {
    button.addEventListener('click', () => {
      weapon = userWeapon(button.classList[0])
      confirm()
      console.log(`Weapon is ${weapon}`)
    })
  }
}

/**
 * randomly generates the computer's move based on game noWeapons
 */
let computerMove = (noWeapons = 3) => {
  let i = Math.floor(Math.random() * noWeapons)
  aiWeapon = gameData[i].name
  console.log(`AI weapon is ${aiWeapon}`)
  return aiWeapon
}
/**
 * Returns user selected weapon
 */
let userWeapon = weapon => {
  console.log(`User weapon is ${weapon}`)
  return weapon
}

/**
 * Creates div to confirm user move
 */
let confirm = () => {
  let confirmDiv = document.createElement("div")
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
  let confirm = document.getElementsByClassName("confirm")[0]
  let confirmNo = document.getElementsByClassName("confirm__no")[0]
  confirmNo.addEventListener("click", () => {
    gameDiv.removeChild(confirm)
  })

  let confirmYes = document.getElementsByClassName("confirm__yes")[0]
  confirmYes.addEventListener("click", () => {
    gamePlay()
  })
}

/**
 * Returns win, lose, or draw, based on outcome of game
 */
let playerWin = () => {
  let res
  if (aiWeapon === player.name) {
    res = "draw"
    return res
  }
  res = !player.weakness.includes(aiWeapon) ? "win" : "lose"
  return res
}

/**
 * displays results screen after every round
 */
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
      playerScore++
      roundNo++
      break
    case "lose":
      html.innerHTML +=
        `<h2>Better luck next time, you silly sausage</h2>`
      aiScore++
      roundNo++
  }

  showScores()

  html.innerHTML += `
        <div class = "replay">
            <h3>Onwards...</h3>
        </div>
    `
  html.classList.add("winDisplay")

  clearGame(gameDiv)
  gameDiv.appendChild(html)

  // reset to continue game
  document.getElementsByClassName("replay")[0].addEventListener("click", () => {
    clearGame(gameDiv)
    showGame()
  })
}

let gamePlay = () => {
  computerMove()
  player = gameData.find(w => weapon === w.name)
  displayWin(playerWin())
}

/**
 * Clears container div
 */
let clearGame = (div) => {
  while (div.firstChild) {
    div.removeChild(div.firstChild)
  }
}

let checkEnd = () => {
  let maxScore = Math.ceil(bestOf / 2)
  // if (aiScore === ) {
  // 
  // }
}

/**
 * Displays game scores
 */
let showScores = () => {
  clearGame(scoreDiv)
  let html = document.createElement("div")
  html.innerHTML = `
        Player Score: ${playerScore}
        AI Score: ${aiScore}
        Round no: ${roundNo}
    `
  scoreDiv.appendChild(html)
}

/**
 * Displays visual icons of weapons
 */
let displayIcons = () => {
  clearGame(gameIconsDiv)
  let html = document.createElement("div")
  html.classList.add(`circle`, `weapons${noWeapons}`)
  for (let i = 0; i < noWeapons; i++) {
    html.innerHTML += `
            <img class="angle${i} gameIcon" src="${gameData[i].img}" alt="${gameData[i].alt}">
        `
    changeCssVars()
  }
  console.log(html)
  gameIconsDiv.appendChild(html)
}

/**
 * Edits CSS variables to allow for pentagon or triangle layout of icons
 */
let changeCssVars = () => {
  let root = document.documentElement
  let incr = 360 / noWeapons
  let a0 = -90
  console.log(`a0 is: ${a0}`)
  for (let i = 0; i < noWeapons; i++) {
    root.style.setProperty(`--angle${i}`, a0 + i * parseInt(incr) + "deg")
    console.log(getComputedStyle(root).getPropertyValue(`--angle${i}`) + `is  angle ${i}`)
  }
}