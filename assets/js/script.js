function startGame() {
    let button = document.getElementById("start-button");
    button.style.backgroundColor = "pink";

    fetchData("../assets/js/data.json");
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data[0].img);
    } catch (error) {
        console.log(error);
    }
}