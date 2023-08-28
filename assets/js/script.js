let gameData = []
const body = document.getElementsByTagName("body")[0]
const gameDiv = document.getElementById("game-div")
const startButton = document.getElementsByClassName("start_button")[0]
const scoreDiv = document.getElementById("score-div")
const aboutButton = document.getElementById("about")
let numberOfWeaponsButton = document.getElementById("no-weapons")
let resetButton
let roundNumber
let weapon
let playerScore
let aiScore
let aiWeapon
let player
let bestOf
let numberOfWeapons = 3
let gameStarted = false
const maxScoreElement = document.getElementById("max-score")
let maxScore
const moveTraceOl = document.getElementById("move-trace-ol")
const descriptionDiv = document.getElementById("description")
const helpButton = document.getElementById("help")

helpButton.addEventListener("click", () => {
  descriptionDiv.classList.toggle("hide")
})

/** 
 * This funtion sets the game up based on the user selected settings.
 * @summary Sets the maxScore and numberOfWeapons variables, and sets intial scores to 0. Runs fetchData() to start game
 */
let startGame = () => {
  gameStarted = true;
  maxScore = parseInt(document.getElementById("max-score").value)
  console.log("max score is " + maxScore)
  fetchData("assets/js/data.json")
  numberOfWeapons = document.getElementById("no-weapons").value
  playerScore = aiScore = roundNumber = 0
  startButton.innerHTML = `
    <h1>Reset</h1>
  `
  aboutButton.addEventListener("click", (link) => {
    link.preventDefault()
    checkInProgress(false, true)

  })
}
/** 
 * This function resets the game to its initial state.
 * @summary Runs clearGame() on various divs to reset them, and toggles the start button between displayin "Start Game" and "Reset".
 */
let resetGame = () => {

  clearGame(gameDiv, scoreDiv, moveTraceOl)
  gameStarted = false;
  startButton.innerHTML = `
    <h1>Start Game</h1>
    `
  startButton.classList.toggle("reset_button")
  startButton.classList.toggle("start_button")
}

startButton.addEventListener("click", () => {
  if (gameStarted) {
    checkInProgress()
  } else {
    startGame()
  }
})

//get number of weapons
numberOfWeaponsButton.addEventListener("change", () => {
  if (gameStarted) {
    checkInProgress()
  } else {
    startGame()
  }
})

/** 
 * This function fetches data from the specified JSON file, and puts it in the gameData array. Runs showGame() once data is fetched.
 * @param {String} url - The url of the JSON file.
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
 * This function runs displayIcons() to show the game icons, and adds event listeners to each icon before running gamePlay() to run the game
 * @summary Will also set the weapon variable to the user selected weapon in the event listener function
 */
let showGame = () => {
  displayIcons()
  // let html = document.createElement("div")
  // for (let i = 0; i < numberOfWeapons; i++) {
  //   html.innerHTML += `
  //           <div class="${gameData[i].name} sel_button">
  //               <h2>${gameData[i].name}</h2>
  //           </div>
  //           `
  // }
  // html.id = "selection"
  // gameDiv.appendChild(html)
  //add event listeners to all instances of sel_button class
  let buttons = document.querySelectorAll(".sel_button, .game_icon").values()
  for (let button of buttons) {
    button.addEventListener('click', () => {

      // set user weapon
      weapon = button.classList[0]
      // confirm()
      gamePlay()
    })
  }
}
/** 
 * This function randomly generates the computer move from a list of weapons
 * @return {String} Returns a string with the computer move.
 */
let computerMove = (numberOfWeapons = 3) => {
  let i = Math.floor(Math.random() * numberOfWeapons)
  aiWeapon = gameData[i].name
  return aiWeapon
}

// /**
//  * Creates div to confirm user move
//  */
// let confirm = () => {
//   let confirmDiv = document.createElement("div")
//   confirmDiv.innerHTML +=
//     `
//         <h1>You chose ${weapon}</h1>
//         <h2>Are you absolutely sure??</h2>
//         <div class = "confirm__yes">
//             <h3>Yes</h3>
//         </div>
//         <div class = "confirm__no">
//             <h3>No</h3>
//         </div>
//     `
//   confirmDiv.classList.add("confirm")
//   gameDiv.appendChild(confirmDiv)
//   let confirm = document.getElementsByClassName("confirm")[0]
//   let confirmNo = document.getElementsByClassName("confirm__no")[0]
//   confirmNo.addEventListener("click", () => {
//     gameDiv.removeChild(confirm)
//   })

//   let confirmYes = document.getElementsByClassName("confirm__yes")[0]
//   confirmYes.addEventListener("click", () => {
//     gamePlay()
//   })
// }

/** 
 * This function calculates the outcome of every round
 * @summary The function checks the player weapon against the computer weapon, and returns "win" if the player won, "lose" if the player lost, or "draw" if the round was a draw
 * @return {String} Returns the result in the form of a String
 */
let player_win = () => {
  let res
  if (aiWeapon === player.name) {
    res = "draw"
    return res
  }
  res = !player.weakness.includes(aiWeapon) ? "win" : "lose"
  return res
}

/** 
 * Displays win screen after every round
 * @summary Replaces contents of gameDiv with HTML stating a loss, a win, or a draw for the player, depending on the res parameter. Runs showScores and moveTrace to update scores and move history.
 * Runs checkEnd to see if game end criteria has been reached. Adds a clickable HTML element that will remove the round win screen and run showGame to continue with the next round.
 * @param {String} res - The result of the round just played (draw/win/lose)
 */
let displayWin = (res) => {
  let html = document.createElement("div")
  html.innerHTML = `
        <h1 class = "ai_${res}">
            AI : ${aiWeapon}
        </h1>
        <h1 class = "player_${res}">
            Player: ${player.name}
        </h1>`

  switch (res) {
    case "draw":
      html.innerHTML += `
            <h2>Let's try that again. You guys are eerily similar</h2>`
      break
    case "win":
      html.innerHTML +=
        `<h2>Player Wins</h2>`
      playerScore++
      roundNumber++
      break
    case "lose":
      html.innerHTML +=
        `<h2>AI Wins</h2>`
      aiScore++
      roundNumber++
  }
  html.classList.add("show_round_win")

  showScores()
  moveTrace()

  html.innerHTML += `
        <div class = "replay button">
            <h3>Continue</h3>
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

  checkEnd()
}

/** 
 * This function runs computerMove()
 * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
 * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
 * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
 */
let gamePlay = () => {
  computerMove()
  player = gameData.find(w => weapon === w.name)
  displayWin(player_win())
}

/** 
 * This function clears the children of the inputted parameter HTML elements
 * @param {HTMLElement} elements - The HTML element/s to be emptied
 */
let clearGame = (...args) => {
  for (let i = 0; i < args.length; i++) {
    while (args[i].firstChild) {
      args[i].removeChild(args[i].firstChild)
    }
  }
}
/** 
 * This function checks if the max score has been reached by either the player or the computer
 * @summary Runs endGame function with parameter false if the computer won, or parameter true of the player won
 */
let checkEnd = () => {
  if (aiScore === maxScore) {
    console.log("Robots Win")
    endGame(false)
  } else if (playerScore === maxScore) {
    console.log("Player Win")
    endGame(true)
  }
}
/** 
 * This function creates the win screen.
 * @summary Displays text based on winner of the game, with a button to leave and start game again
 * @param {boolean} playerWin - true if player won, false if computer won
 */
let endGame = (playerWin) => {
  let html = document.createElement("div")
  html.classList.add("win_screen", "warning_div")
  if (playerWin) {

    html.innerHTML = `
        <div class="warning_div_inner">
          <h1>Congrats</h1>
          <p>
            You did it
          </p>
          <div class="check_buttons">
            <div class="check_leave check_button button">
              <h3>Leave</h3>
            </div>
          </div>
        </div>
      `
  } else {
    html.innerHTML = `
        <div class="warning_div_inner">
          <h1>Oh no!</h1>
          <p>
            You did no do it
          </p>
          <p>
            Don't let this have any impact on your sense of self worth <3
          </p>
          <div class="check_buttons">
            <div class="check_leave check_button button">
              <h3>Leave</h3>
            </div>
          </div>
          `
    //   <div class="check_stay check_button button">
    //     <h3>Stay</h3>
    //   </div>
    // </div>
  }
  body.appendChild(html)
  let winScreen = document.getElementsByClassName("win_screen")[0]
  // warningDiv.addEventListener("")
  // document.getElementsByClassName("check_stay")[0].addEventListener("click", () => {
  //   body.removeChild(winScreen)
  // })
  document.getElementsByClassName("check_leave")[0].addEventListener("click", () => {
    resetGame()
    body.removeChild(winScreen)
  })
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
        Round no: ${roundNumber}
    `
  scoreDiv.appendChild(html)
}

let moveTrace = () => {
  let html = document.createElement("li")
  html.innerHTML = `
    Round ${roundNumber} || Player ${player.name} || AI ${aiWeapon}
  `
  moveTraceOl.appendChild(html)
}

/**
 * Displays visual icons of weapons
 */
let displayIcons = () => {
  // clearGame(game_iconsDiv)
  let html = document.createElement("div")
  html.classList.add(`circle`, `weapons${numberOfWeapons}`)
  for (let i = 0; i < numberOfWeapons; i++) {
    html.innerHTML += `
            <img class="${gameData[i].name} angle${i} game_icon" src="${gameData[i].img}" alt="${gameData[i].alt}">
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
  let incr = 360 / numberOfWeapons
  let a0 = -90
  for (let i = 0; i < numberOfWeapons; i++) {
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