const game = document.getElementById("battleship");
const gameboard = document.getElementById("gameboard");
const scores = document.getElementById("scores");
const hitboard = document.getElementById("hitboard");

let playerHits = 0;
let computerHits = 0;
let playerMisses = 0;
let computerMisses = 0;

document.addEventListener("DOMContentLoaded", function () {
    createGrid();
    scoreGrid();
    createShips();
    createScore();

    const startButton = document.getElementById("start");
    startButton.addEventListener("click", function () {
        if (areAllShipsPlaced()) {
            startGame();
        } else {
            alert("Please place all ships on the board before starting the game.");
        }
    });

    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function () {
        reset();
    });
    

    const hitboardCells = document.querySelectorAll('.hit-item');
    hitboardCells.forEach(cell => {
        cell.addEventListener('click', function () {
            if (!cell.classList.contains('hit')) {
                cell.classList.add('hit');
                if (cell.dataset.ship) {
                    cell.style.backgroundColor = 'red'; // Hit
                    playerHits++;
                    updateScores();
                    checkPlayerWin()
                } else {
                    cell.style.backgroundColor = 'blue'; // Miss
                    playerMisses++;
                    updateScores();
                    checkComputerWin();
                }
                // Check if all player ships are hit
                checkPlayerWin();
                
                // Let computer play
                computerPlay();

            }
        });
    });
});

function reset() {
    console.log("reset");
    clearGrid();
    clearScoreGrid();
    createShips();
    document.getElementById("hitboard").style.display = "none";
    document.getElementById("ship-holding-area").style.display = "flex";
    playerHits = 0;
    computerHits = 0;
    playerMisses = 0;
    computerMisses = 0;
    updateScores();
};

function computerPlay() {
    // Randomly select a square on the player's gameboard
    const gameboardCells = document.querySelectorAll('.grid-item');
    let availableCells = Array.from(gameboardCells).filter(cell => !cell.classList.contains('hit'));
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const selectedCell = availableCells[randomIndex];
    selectedCell.classList.add('hit');
    if (selectedCell.classList.contains('ship')) {
        selectedCell.style.backgroundColor = 'red'; // Hit
        computerHits++;
        updateScores();
    } else {
        selectedCell.style.backgroundColor = 'blue'; // Miss
        computerMisses++;
        updateScores();
    }
    // Check if all computer ships are hit
    checkComputerWin();
}

function checkPlayerWin() {
    if (playerHits === 17) { // Total number of hits to sink all player ships
        alert("Player has won!");
        reset();
    }
}

function checkComputerWin() {
    if (computerHits === 17) { // Total number of hits to sink all player ships
        alert("Computer has won!");
        reset();
    }
}

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
            gridItem.addEventListener('dragover', function(event) {
                event.preventDefault();
            });
            gridItem.addEventListener('drop', function(event) {
                event.preventDefault();
                const shipId = event.dataTransfer.getData("text");
                const ship = document.getElementById(shipId);
                const shipLength = ship.childElementCount;
                const startRow = row;
                const startCol = col;
                const orientation = ship.dataset.orientation;

                if (canPlaceShip(startRow, startCol, shipLength, orientation)) {
                    placeShipOnGrid(ship, startRow, startCol, orientation);
                }
            });
            container.appendChild(gridItem);
        }
    }
}

function scoreGrid() {
    const container = document.getElementById('hitboard');
    const rows = 10;
    const cols = 10;

    let remainingShips = {
        'Carrier': 5,
        'Battleship': 4,
        'Cruiser': 3,
        'Submarine': 3,
        'Destroyer': 2
    };

    let totalShips = Object.keys(remainingShips).length;

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
                if (gridItem.dataset.ship) {
                    gridItem.style.backgroundColor = 'red'; // Hit
                    remainingShips[gridItem.dataset.ship]--;
                    if (remainingShips[gridItem.dataset.ship] === 0) {
                        delete remainingShips[gridItem.dataset.ship];
                        totalShips--;
                        if (totalShips === 0) {
                            checkPlayerWin();
                        }
                    }
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
        item.classList.remove('ship', 'Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer', 'hit', 'ship-1', 'ship-2', 'ship-3', 'ship-4');
        item.style.backgroundColor = '';
    });
    
}

function clearScoreGrid() {
    const hitItems = document.querySelectorAll('.hit-item');
    hitItems.forEach(item => {
        item.style.backgroundColor = ''; // Clear background color
    });
}

function createShips() {
    const shipHoldingArea = document.getElementById('ship-holding-area');
    shipHoldingArea.innerHTML = ''; // Clear any existing ships

    const ships = [
        { name: 'Carrier', length: 5 },
        { name: 'Battleship', length: 4 },
        { name: 'Cruiser', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Destroyer', length: 2 }
    ];

    ships.forEach((ship, index) => {
        const shipElement = document.createElement('div');
        shipElement.id = `ship-${index}`;
        shipElement.classList.add('ship');
        shipElement.dataset.orientation = 'horizontal';
        shipElement.draggable = true;
        shipElement.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData("text", event.target.id);
        });

        for (let i = 0; i < ship.length; i++) {
            const segment = document.createElement('div');
            segment.classList.add('segment');
            shipElement.appendChild(segment);
        }

        shipHoldingArea.appendChild(shipElement);
    });
}

function placeShipsRandomly() {
    clearGrid();
    clearScoreGrid(); // Also clear the score grid

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
            const startRow = Math.floor(Math.random() * rows); // Random row from 0 to 9
            const startCol = Math.floor(Math.random() * cols); // Random column from 0 to 9

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

function canPlaceShip(startRow, startCol, length, orientation) {
    const rows = 10;
    const cols = 10;
    if (orientation === 'horizontal') {
        if (startCol + length > cols) return false;
        for (let i = 0; i < length; i++) {
            const cell = document.getElementById(`grid-${startRow}-${startCol + i}`);
            if (cell.classList.contains('ship')) return false;
        }
    } else {
        if (startRow + length > rows) return false;
        for (let i = 0; i < length; i++) {
            const cell = document.getElementById(`grid-${startRow + i}-${startCol}`);
            if (cell.classList.contains('ship')) return false;
        }
    }
    return true;
}

function placeShipOnGrid(ship, startRow, startCol, orientation) {
    const shipSegments = Array.from(ship.children);
    if (orientation === 'horizontal') {
        shipSegments.forEach((segment, index) => {
            const cell = document.getElementById(`grid-${startRow}-${startCol + index}`);
            cell.classList.add('ship', ship.id);
        });
    } else {
        shipSegments.forEach((segment, index) => {
            const cell = document.getElementById(`grid-${startRow + index}-${startCol}`);
            cell.classList.add('ship', ship.id);
        });
    }
    ship.remove();
}

function areAllShipsPlaced() {
    const shipHoldingArea = document.getElementById('ship-holding-area');
    return shipHoldingArea.children.length === 0;
}

function startGame() {
    // Check if all ships are placed on the gameboard
    if (areAllShipsPlaced()) {
        // Hide the ship-holding area
        const shipHoldingArea = document.getElementById('ship-holding-area');
        shipHoldingArea.style.display = 'none';

        // Display the hitboard
        const hitboard = document.getElementById('hitboard');
        hitboard.style.display = 'grid';

        // Place ships randomly on the hitboard
        placeShipsRandomlyOnHitboard();
    } else {
        alert("Please place all ships on the board before starting the game.");
    }
}

function placeShipsRandomlyOnHitboard() {
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
            const startRow = Math.floor(Math.random() * rows); // Random row from 0 to 9
            const startCol = Math.floor(Math.random() * cols); // Random column from 0 to 9

            if (orientation === 'horizontal') {
                if (startCol + ship.length - 1 < cols && canPlaceShip(startRow, startCol, ship.length, orientation, grid)) {
                    for (let i = 0; i < ship.length; i++) {
                        grid[startRow][startCol + i] = ship.name;
                        const cell = document.getElementById(`hit-${startRow}-${startCol + i}`);
                        cell.dataset.ship = ship.name;
                    }
                    placed = true;
                }
            } else {
                if (startRow + ship.length - 1 < rows && canPlaceShip(startRow, startCol, ship.length, orientation, grid)) {
                    for (let i = 0; i < ship.length; i++) {
                        grid[startRow + i][startCol] = ship.name;
                        const cell = document.getElementById(`hit-${startRow + i}-${startCol}`);
                        cell.dataset.ship = ship.name;
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

    const playerH = document.createElement("div")
    playerH.classList.add('score');
    playerH.id = `player-hits`;
    playerH.textContent = `Player Hits: ${playerHits}`;
    scoreContainer.appendChild(playerH);

    const playerM = document.createElement("div")
    playerM.classList.add('score');
    playerM.id = `player-misses`;
    playerM.textContent = `Player Misses: ${playerMisses}`;
    scoreContainer.appendChild(playerM);

    const computerH = document.createElement("div")
    computerH.classList.add('score');
    computerH.id = `computer-hits`;
    computerH.textContent = `computer Hits: ${computerHits}`;
    scoreContainer.appendChild(computerH);

    const computerM = document.createElement("div")
    computerM.classList.add('score');
    computerM.id = `computer-misses`;
    computerM.textContent = `computer Misses: ${computerMisses}`;
    scoreContainer.appendChild(computerM);
    
}

function updateScores() {
    const playerHitsElem = document.getElementById("player-hits");
    const playerMissesElem = document.getElementById("player-misses");

    playerHitsElem.textContent = `Player Hits: ${playerHits}`;
    playerMissesElem.textContent = `Player Misses: ${playerMisses}`;

    const computerHitsElem = document.getElementById("computer-hits");
    const computerMissesElem = document.getElementById("computer-misses");

    computerHitsElem.textContent = `computer Hits: ${computerHits}`;
    computerMissesElem.textContent = `computer Misses: ${computerMisses}`;
}