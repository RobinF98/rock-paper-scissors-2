let gameData = []
const body = document.getElementsByTagName("body")[0]
const gameDiv = document.getElementById("game-div")
const startButton = document.getElementsByClassName("start_button")[0]
const scoreDiv = document.getElementById("score-div")
const aboutButton = document.getElementById("about")
let noWeaponsButton = document.getElementById("no-weapons")
let resetButton
let weapon
let playerScore
let aiScore
let aiWeapon
let player
let bestOf
let noWeapons = 3
let gameStarted = false

/**
 * Sets variables to 0 and runs game etc etc 
 */
let startGame = () => {
  gameStarted = true;
  // if (checkInProgress()) {
  //   return
  // }
  // clearGame(gameDiv)
  fetchData("assets/js/data.json")

  playerScore = aiScore = roundNo = 0
  startButton.innerHTML = `
    <h1>Reset</h1>
  `
  aboutButton.addEventListener("click", (link) => {
    link.preventDefault()
    checkInProgress(false, true)
  })
}

let resetGame = () => {

  clearGame(gameDiv, scoreDiv)
  gameStarted = false;
  startButton.innerHTML = `
    <h1>Start Game</h1>
    `
  startButton.classList.toggle("reset_button")
  startButton.classList.toggle("start_button")
  console.log("Game Has been RESET")
}

startButton.addEventListener("click", () => {
  if (gameStarted) {
    checkInProgress()
  } else {
    startGame()
  }
})

// startButton.addEventListener("click", startGame)
//get number of weapons
noWeaponsButton.addEventListener("change", () => {
  noWeapons = document.getElementById("no-weapons").value
  startGame()
})

// resetButton.addEventListener("click", () => {
//   clearGame(gameDiv, scoreDiv)
// })

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
  let buttons = document.querySelectorAll(".selButton, .gameIcon").values()
  for (let button of buttons) {
    button.addEventListener('click', () => {
      weapon = userWeapon(button.classList[0])
      confirm()
    })
  }
}

/**
 * randomly generates the computer's move based on game noWeapons
 */
let computerMove = (noWeapons = 3) => {
  let i = Math.floor(Math.random() * noWeapons)
  aiWeapon = gameData[i].name
  return aiWeapon
}
/**
 * Returns user selected weapon
 */
let userWeapon = weapon => {
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
let clearGame = (...args) => {
  for (let i = 0; i < args.length; i++) {
    while (args[i].firstChild) {
      args[i].removeChild(args[i].firstChild)
    }
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
        Player Score: ${playerScore} <br>
        AI Score: ${aiScore} <br>
        Round no: ${roundNo}
    `
  scoreDiv.appendChild(html)
}

/**
 * Displays visual icons of weapons
 */
let displayIcons = () => {
  // clearGame(gameIconsDiv)
  let html = document.createElement("div")
  html.classList.add(`circle`, `weapons${noWeapons}`)
  for (let i = 0; i < noWeapons; i++) {
    html.innerHTML += `
            <img class="${gameData[i].name} angle${i} gameIcon" src="${gameData[i].img}" alt="${gameData[i].alt}">
        `
    changeCssVars()
  }
  gameDiv.appendChild(html)
}

/**
 * Edits CSS variables to allow for pentagon or triangle layout of icons
 */
let changeCssVars = () => {
  let root = document.documentElement
  let incr = 360 / noWeapons
  let a0 = -90
  for (let i = 0; i < noWeapons; i++) {
    root.style.setProperty(`--angle${i}`, a0 + i * parseInt(incr) + "deg")
  }
}

let checkInProgress = (noQuery = false, about = false) => {
  if (aiScore > 0 || playerScore > 0) {
    if (!noQuery) {
      queryLeave(about)
    }
    return true
  } else {
    resetGame()
    return false
  }
}

let queryLeave = (about = false) => {
  let html = document.createElement("div")
  html.classList.add("warning_div")
  html.innerHTML = `
      <div class="warning_div_inner">
        <h1>Are you sure you want to leave?</h1>
        <p>
          You will lose all your current progress
        </p>
        <div class="check_buttons">
          <div class="check_leave check_button button">
            <h3>Leave</h3>
          </div>
          <div class="check_stay check_button button">
            <h3>Stay</h3>
          </div>
        </div>
      </div>
    `
  body.appendChild(html)
  let warningDiv = document.getElementsByClassName("warning_div")[0]
  // warningDiv.addEventListener("")
  document.getElementsByClassName("check_stay")[0].addEventListener("click", () => {
    body.removeChild(warningDiv)
  })
  document.getElementsByClassName("check_leave")[0].addEventListener("click", () => {
    resetGame()
    if (about) {
      window.location.replace("about.html")
    }
    body.removeChild(warningDiv)
  })
}