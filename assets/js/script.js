let gameData1 = [{
        "name": "rock",
        "weakness": ["paper", "spock"],
        "img": "./assets/images/rock.svg",
        "alt": "Vector image of a hand making a rock gesture"
    },
    {
        "name": "paper",
        "weakness": ["scissors", "lizard"],
        "img": "./assets/images/paper.svg",
        "alt": "Vector image of a hand making a paper gesture"
    },
    {
        "name": "scissors",
        "weakness": ["rock", "spock"],
        "img": "./assets/images/scissors.svg",
        "alt": "Vector image of a hand making a scissors gesture"
    },
    {
        "name": "lizard",
        "weakness": ["rock", "scissors"],
        "img": "./assets/images/lizard.svg",
        "alt": "Vector image of a hand making a lizard gesture"
    },
    {
        "name": "spock",
        "weakness": ["paper", "lizard"],
        "img": "./assets/images/spock.svg",
        "alt": "Vector image of a hand making a vulcan salute gesture"
    }
];

gameData = []

let startGame = () => {
    let button = document.getElementById("start-button")
    button.style.backgroundColor = "pink"
    // let gameData = buildData()
    fetchData("../assets/js/data.json")
    console.log(gameData1)
    console.log("^ gamedata 1, below is gameData");
    console.log(gameData)
}


/* 
 * fetch data from specified json file url
 */
let fetchData = async url => {
    try {
        const response = await fetch(url)
        const data = await response.json()

        // for (let i = 0; i < data.length; i++) {
        //     gameData.push(data[i]);
        // }
        gameData.map()

    } catch (error) {
        console.log(error)
    }
}

let buildData = async () => {
    let gameData = await fetchData("../assets/js/data.json")
    console.log(gameData)
    return Promise.resolve(gameData)
}

let showGame = (bestOf, noWeapons = 3) => {
    const html = `<div class='gameDiv'>
                    <div class = 'selButton rockButton' onClick =></div>
                </div>`
}

let computerMove = (difficulty = 3) => {

}