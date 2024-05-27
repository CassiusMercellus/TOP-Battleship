const game = document.getElementById("battleship");
const gameboard = document.getElementById("gameboard");
const scores = document.getElementById("scores");

let blueHits = 0;
let redHits = 0;
let blueMisses = 0;
let redMisses = 0;

function createGrid() {
    const container = gameboard;
    const rows = 10;
    const cols = 10;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.id = `grid-${row}-${col}`;
            gridItem.textContent = `${row},${col}`; // Optional: Add the coordinates inside each grid item
            container.appendChild(gridItem);
        }
    }
}

function createScore() {

    const scoreContainer = scores;

    const blueH = document.createElement("div")
    blueH.classList.add('score');
    blueH.id = `scores`;
    blueH.textContent = `Blue Hits: ${blueHits}`;
    scoreContainer.appendChild(blueH);

    const blueM = document.createElement("div")
    blueM.classList.add('score');
    blueM.id = `scores`;
    blueM.textContent = `Blue Misses: ${blueMisses}`;
    scoreContainer.appendChild(blueM);

    const redH = document.createElement("div")
    redH.classList.add('score');
    redH.id = `scores`;
    redH.textContent = `Red Hits: ${redHits}`;
    scoreContainer.appendChild(redH);

    const redM = document.createElement("div")
    redM.classList.add('score');
    redM.id = `scores`;
    redM.textContent = `Red Misses: ${redMisses}`;
    scoreContainer.appendChild(redM);
    
}

createScore()
createGrid()