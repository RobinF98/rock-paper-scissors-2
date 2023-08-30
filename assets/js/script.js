/* jshint esversion:8 */
const body = document.getElementsByTagName("body")[0]
const gameDiv = document.getElementById("game-div")
const startButton = document.getElementsByClassName("start_button")[0]
const scoreDiv = document.getElementById("score-div")
const aboutButton = document.getElementById("about")
const moveTraceOl = document.getElementById("move-trace-ol")
const descriptionDiv = document.getElementById("description")
const helpButton = document.getElementById("help")
let gameData = []
let numberOfWeaponsButton = document.getElementById("no-weapons")
let roundNumber
let weapon
let playerScore
let aiScore
let aiWeapon
let player
let numberOfWeapons = 3
let gameStarted = false
let maxScore

helpButton.addEventListener("click", () => {
  descriptionDiv.classList.toggle("hide")
})

/** 
 * This function sets the game up based on the user selected settings.
 * @summary Sets the maxScore and numberOfWeapons variables, and sets intial scores to 0. Runs fetchData() to start game
 */
let startGame = () => {
  gameStarted = true;
  maxScore = parseInt(document.getElementById("max-score").value)
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
  //clear div contents
  clearGame(gameDiv, scoreDiv, moveTraceOl)
  gameStarted = false;
  startButton.innerHTML = `
    <h1>Start Game</h1>
    `
  startButton.classList.toggle("reset_button")
  startButton.classList.toggle("start_button")
  // hide score div
  scoreDiv.classList.add("hide_score")
}

/** 
 * This event listener runs when the start button is clicked to start the game.
 * @summary Checks if game is in progress, and prompts the user if they want to leave and start a new game.
 */
startButton.addEventListener("click", () => {
  if (gameStarted) {
    checkInProgress()
  } else {
    startGame()
  }
})

/** 
 * This event listener runs when user changes the number of weapons (difficulty) setting.
 * @summary Checks if game is in progress, and prompts the user if they want to leave and start a new game with new difficulty setting
 */
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

  //add event listeners to all instances of select_button class
  let buttons = document.querySelectorAll(".select_button, .game_icon").values()
  for (let button of buttons) {
    button.addEventListener('click', () => {

      // set user weapon
      weapon = button.classList[0]
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

/** 
 * This function calculates the outcome of every round
 * @summary The function checks the player weapon against the computer weapon, and returns "win" if the player won, "lose" if the player lost, or "draw" if the round was a draw
 * @return {String} Returns the result in the form of a String
 */
let player_win = () => {
  let result
  if (aiWeapon === player.name) {
    result = "draw"
    return result
  }
  result = !player.weakness.includes(aiWeapon) ? "win" : "lose"
  return result
}

/** 
 * Displays win screen after every round
 * @summary Replaces contents of gameDiv with HTML stating a loss, a win, or a draw for the player, depending on the result parameter. Runs showScores and moveTrace to update scores and move history.
 * Runs checkEnd to see if game end criteria has been reached. Adds a clickable HTML element that will remove the round win screen and run showGame to continue with the next round.
 * @param {String} result - The result of the round just played (draw/win/lose)
 */
let displayWin = (result) => {
  let html = document.createElement("div")
  html.innerHTML = `
        <h2 class = "ai_${result}">
            AI : ${aiWeapon}
        </h2>
        <h2 class = "player_${result}">
            Player: ${player.name}
        </h2>`

  switch (result) {
    case "draw":
      html.innerHTML += `
            <h3>Let's try that again. You guys are eerily similar</h3>`
      break
    case "win":
      html.innerHTML +=
        `<h3>Player Wins</h3>`
      playerScore++
      roundNumber++
      break
    case "lose":
      html.innerHTML +=
        `<h3>AI Wins</h3>`
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
 * This function runs computerMove() and gets the player weapon. It then compares the two in player_win(), and runs displayWin() with the result
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
    endGame(false)
  } else if (playerScore === maxScore) {
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
          <h2>Congrats</h2>
          <h3>
            You Win!
          </h3>
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
          <h2>Oh no!</h2>
          <h3>
            The computer won
          </h3>
          <p>
            Don't stress, you can always try again <3
          </p>
          <div class="check_buttons">
            <div class="check_leave check_button button">
              <h3>Leave</h3>
            </div>
          </div>
          `
  }
  body.appendChild(html)
  let winScreen = document.getElementsByClassName("win_screen")[0]
  document.getElementsByClassName("check_leave")[0].addEventListener("click", () => {
    resetGame()
    body.removeChild(winScreen)
  })
}

/** 
 * This function displays and updates the scores every round
 * @summary It keeps track of the Player score, the Computer score, and the round number.
 */
let showScores = () => {
  clearGame(scoreDiv)
  let html = document.createElement("div")
  html.innerHTML = `
        Player Score: ${playerScore} <br>
        AI Score: ${aiScore} <br>
        Round: ${roundNumber}
    `
  scoreDiv.appendChild(html)
  // Show score div
  if (gameStarted) {
    scoreDiv.classList.remove("hide_score")
  }
}

/** 
 * This function displays all the moves already made in the current iteration of the game
 * @summary This is for the user's convenience, but it is also useful to have for future updates that may include pattern recognition
 */
let moveTrace = () => {
  let html = document.createElement("li")
  html.innerHTML = `
    Round ${roundNumber} || Player ${player.name} || AI ${aiWeapon}
  `
  moveTraceOl.appendChild(html)
}

/** 
 * This function adds the game icons to the game div, and sets up the classes used in the css for styling the icons
 * Runs changeCssVars() to edit styling based on current game settings
 */
let displayIcons = () => {
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
 * This function edits the CSS variables in the root tag, to allow for variable styling of the game icons
 * @summary This allows for future updates where the user can edit the styling through the GUI, and for further addition of weapons
 */
let changeCssVars = () => {
  let root = document.documentElement
  let incr = 360 / numberOfWeapons
  let a0 = -90
  for (let i = 0; i < numberOfWeapons; i++) {
    root.style.setProperty(`--angle${i}`, a0 + i * parseInt(incr) + "deg")
  }
}

/** 
 * This function checks if a game is in progress
 * @summary If a game is running, but there is no score (i.e. the previous round(s) were all draws), returns false. If there is a score, returns true.
 * Runs queryLeave to check with user if they really want to leave.
 * @param {Boolean} noQuery - false by default - when true the function will not run queryLeave()
 * @param {Boolean} about - false by default - true when function is called by clicking About button - will then run queryLeave(about = true).
 * @return {Boolean} true if game is in progress - false otherwise.
 */
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
/** 
 * This function displays a prompt when run, asking the user if they really want to leave.
 * @summary Has buttons to let the user leave or stay. If about is true, clicking leave will navigate to about.html
 * @param {Boolean} about - true if function is called from user clicking about button, false otherwise
 */
let queryLeave = (about = false) => {
  let html = document.createElement("div")
  html.classList.add("warning_div")
  html.innerHTML = `
      <div class="warning_div_inner">
        <h2>Are you sure you want to leave?</h2>
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