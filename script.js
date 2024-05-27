const game = document.getElementById("battleship");
const gameboard = document.getElementById("gameboard");
const scores = document.getElementById("scores");
const hitboard = document.getElementById("hitboard");

let blueHits = 0;
let redHits = 0;
let blueMisses = 0;
let redMisses = 0;

document.addEventListener("DOMContentLoaded", function() {
    createGrid();
    scoreGrid();
    placeShipsRandomly();

    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function() {
        clearScoreGrid();
        placeShipsRandomly();
    });
});

function createGrid() {
    const container = document.getElementById('gameboard');
    const rows = 10;
    const cols = 10;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.classList.add(`r-${row}`);
            gridItem.classList.add(`c-${col}`);
            gridItem.id = `grid-${row}-${col}`;
            gridItem.textContent = `${row},${col}`; // Optional: Add the coordinates inside each grid item
            container.appendChild(gridItem);
        }
    }
}

function scoreGrid() {
    const container = document.getElementById('hitboard');
    const rows = 10;
    const cols = 10;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('hit-item');
            gridItem.classList.add(`r-${row}`);
            gridItem.classList.add(`c-${col}`);
            gridItem.id = `hit-${row}-${col}`;
            gridItem.textContent = `${row},${col}`; // Optional: Add the coordinates inside each grid item

            // Add event listener to check for a ship and change color
            gridItem.addEventListener('click', function() {
                const gameboardCell = document.getElementById(`grid-${row}-${col}`);
                if (gameboardCell.classList.contains('ship')) {
                    gridItem.style.backgroundColor = 'red'; // Hit
                } else {
                    gridItem.style.backgroundColor = 'blue'; // Miss
                }
            });

            container.appendChild(gridItem);
        }
    }
}

function clearGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.classList.remove('ship', 'Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer');
    });
}

function clearScoreGrid() {
    const hitItems = document.querySelectorAll('.hit-item');
    hitItems.forEach(item => {
        item.style.backgroundColor = ''; // Clear background color
    });
}

function placeShipsRandomly() {
    clearGrid();
    clearScoreGrid(); // Also clear the score grid

    const container = document.getElementById('gameboard');
    const rows = 10;
    const cols = 10;

    const ships = [
        { name: 'Carrier', length: 5 },
        { name: 'Battleship', length: 4 },
        { name: 'Cruiser', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Destroyer', length: 2 }
    ];

    const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));

    ships.forEach(ship => {
        let placed = false;
        while (!placed) {
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const startRow = Math.floor(Math.random() * (rows - 1)) + 1; // Random row from 1 to 9
            const startCol = Math.floor(Math.random() * (cols - 1)) + 1; // Random column from 1 to 9

            if (orientation === 'horizontal') {
                if (startCol + ship.length - 1 < cols && canPlaceShip(startRow, startCol, ship.length, orientation, grid)) {
                    for (let i = 0; i < ship.length; i++) {
                        grid[startRow][startCol + i] = ship.name;
                        const cell = document.getElementById(`grid-${startRow}-${startCol + i}`);
                        cell.classList.add('ship', ship.name);
                    }
                    placed = true;
                }
            } else {
                if (startRow + ship.length - 1 < rows && canPlaceShip(startRow, startCol, ship.length, orientation, grid)) {
                    for (let i = 0; i < ship.length; i++) {
                        grid[startRow + i][startCol] = ship.name;
                        const cell = document.getElementById(`grid-${startRow + i}-${startCol}`);
                        cell.classList.add('ship', ship.name);
                    }
                    placed = true;
                }
            }
        }
    });

    function canPlaceShip(startRow, startCol, length, orientation, grid) {
        if (orientation === 'horizontal') {
            for (let i = 0; i < length; i++) {
                if (grid[startRow][startCol + i] !== null) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < length; i++) {
                if (grid[startRow + i][startCol] !== null) {
                    return false;
                }
            }
        }
        return true;
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