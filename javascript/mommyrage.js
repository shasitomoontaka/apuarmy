const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');


// Load images
const pacmanImage = new Image();
pacmanImage.src = '/images/mommyrage/image1.png';

const ghostImage = new Image();
ghostImage.src = '/images/mommyrage/image2.png';

const coin1Image = new Image();
coin1Image.src = '/images/mommyrage/image3.png';

const coin2Image = new Image();
coin2Image.src = '/images/mommyrage/image4.png';

// Overlay image for start screen
const overlayImage = new Image();
overlayImage.src = '/images/mommyrage/mommyrage.jpg';

// Game variables
const pacman = { x: 32, y: 32, width: 32, height: 32, speed: 8 };
const ghost = { x: 64, y: 64, width: 32, height: 32, speed: 1, dir: 'right' };
const numSquares = 20;
const squares = [];
const coins = [];
let score = 0;
let gameOver = false;
let startTime;
let currentTime = 0; // Initialize currentTime to 0

let keys = {};

// Function to draw the initial overlay
function drawInitialOverlay() {
    ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('', canvas.width / 2, canvas.height / 2);
}

// Load overlay image first and draw it immediately
overlayImage.onload = () => {
    drawInitialOverlay();
    checkAllImagesLoaded();
};

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent the default scroll behavior
        keys[e.key] = true; // Register key as pressed
    }
});

document.addEventListener('keyup', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent the default scroll behavior
        keys[e.key] = false; // Register key as released
    }
});


// Function to generate random positions
function getRandomPosition(size) {
    return {
        x: Math.floor(Math.random() * (canvas.width - size - 2 * 32)) + 32,
        y: Math.floor(Math.random() * (canvas.height - size - 2 * 32)) + 32
    };
}

// Function to check overlap
function isOverlapping(pos1, size1, pos2, size2) {
    return !(pos1.x + size1 <= pos2.x || pos1.x >= pos2.x + size2 || pos1.y + size1 <= pos2.y || pos1.y >= pos2.y + size2);
}

// Function to start the game
function startGame() {
    // Reset game variables
    squares.length = 0;
    coins.length = 0;
    score = 0;
    gameOver = false;
    currentTime = 0; // Reset currentTime
    startTime = Date.now(); // Initialize the start time

    // Initialize game
    initGame();
    pacman.speed = 32; // Set initial character speed to 4

    // Start game loop
    gameLoop();
}

// Function to initialize game
function initGame() {
    // Clear existing squares and coins
    squares.length = 0;
    coins.length = 0;

    const gridSize = 32; // Size of each grid cell

    // Generate boundary walls
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            // Define boundary walls
            if (i === 0 || j === 0 || i === 15 || j === 15) {
                squares.push({
                    x: i * gridSize,
                    y: j * gridSize,
                    width: gridSize,
                    height: gridSize
                });
            }
        }
    }

    // Place Pac-Man at B2
    pacman.x = 1 * gridSize;
    pacman.y = 1 * gridSize;

    // Place ghost at O14
    ghost.x = 14 * gridSize;
    ghost.y = 13 * gridSize;

    // Generate 16 squares in random positions
    for (let i = 0; i < 16; i++) {
        let square;
        do {
            // Generate a random position within the grid
            const randomX = Math.floor(Math.random() * 14 + 1) * gridSize;
            const randomY = Math.floor(Math.random() * 14 + 1) * gridSize;
            square = { x: randomX, y: randomY, width: gridSize, height: gridSize };
        } while (squares.some(s => isOverlapping(s, gridSize, square, gridSize)) ||
                 isOverlapping(square, gridSize, pacman, pacman.width) ||
                 isOverlapping(square, gridSize, ghost, ghost.width));

        // Add the square to the list of squares
        squares.push(square);
    }
}

// Function to generate coins
function generateCoins() {
    const gridSize = 32; // Size of each grid cell
    const availableCells = []; // Array to store available cells for placing coins

    // Find available cells excluding those occupied by Pac-Man and Ghost
    for (let i = 1; i < 15; i++) {
        for (let j = 1; j < 15; j++) {
            let cellOccupied = squares.some(square => square.x === i * gridSize && square.y === j * gridSize);
            if (!cellOccupied && !(i === 1 && j === 1) && !(i === 14 && j === 13)) {
                availableCells.push({ x: i * gridSize + 8, y: j * gridSize + 8 });
            }
        }
    }

    // Place coins on available cells
    const numCoinsToAdd = Math.floor(Math.random() * 3) + 1; // Random number of coins to add
    for (let i = 0; i < numCoinsToAdd; i++) {
        // Select a random available cell
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cell = availableCells[randomIndex];

        // Push a new coin to the coins array
        coins.push({
            x: cell.x,
            y: cell.y,
            type: Math.random() < 0.5 ? 1 : 2, // Random coin type
            collected: false
        });

        // Remove the selected cell from availableCells to avoid placing another coin there
        availableCells.splice(randomIndex, 1);
    }
}

// Add new coins continuously using setInterval
setInterval(generateCoins, 5000); // Add new coin every 5 seconds



// Handle start button click
startButton.addEventListener('click', () => {
    // Retry until a valid game start condition is met
    while (true) {
        // Check if Pac-Man and Ghost can spawn without colliding with walls
        let pacmanSpawnValid = squares.every(square => !isOverlapping(pacman, square));
        let ghostSpawnValid = squares.every(square => !isOverlapping(ghost, square));

        if (pacmanSpawnValid && ghostSpawnValid) {
            // Start the game
            startGame();
            break;
        } else {
            // Retry
            initGame();
        }
    }
});

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});



// Adjust the checkCollision function to consider the actual position and size of squares
function checkCollision(obj) {
    for (let square of squares) {
        // Calculate the center of the character
        const characterCenterX = obj.x + obj.width / 2;
        const characterCenterY = obj.y + obj.height / 2;

        // Calculate the center of the square
        const squareCenterX = square.x + square.width / 2;
        const squareCenterY = square.y + square.height / 2;

        // Calculate the distance between the character center and the square center
        const dx = Math.abs(characterCenterX - squareCenterX);
        const dy = Math.abs(characterCenterY - squareCenterY);

        // Calculate the maximum distance where collision occurs
        const maxDistanceX = (obj.width + square.width) / 2;
        const maxDistanceY = (obj.height + square.height) / 2;

        // Check if the distance is within the collision range
        if (dx < maxDistanceX && dy < maxDistanceY) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}









// Check collision with ghost
function checkGhostCollision() {
    return pacman.x < ghost.x + ghost.width && pacman.x + pacman.width > ghost.x &&
           pacman.y < ghost.y + ghost.height && pacman.y + pacman.height > ghost.y;
}

// Update game state
function update() {
    if (gameOver) return;

    let speed = pacman.speed; // Character speed

    // Move the character
    let newX = pacman.x;
    let newY = pacman.y;
    if (keys['ArrowUp']) newY -= speed;
    if (keys['ArrowDown']) newY += speed;
    if (keys['ArrowLeft']) newX -= speed;
    if (keys['ArrowRight']) newX += speed;

    // Check if the new position collides with any walls
    let collidesWithWall = squares.some(square => {
        return newX < square.x + 32 &&
               newX + pacman.width > square.x &&
               newY < square.y + 32 &&
               newY + pacman.height > square.y;
    });

    // If there is no collision with any wall, update the character's position
    if (!collidesWithWall) {
        pacman.x = Math.max(0, Math.min(newX, canvas.width - pacman.width));
        pacman.y = Math.max(0, Math.min(newY, canvas.height - pacman.height));
    }

    keys = {}; // Reset keys after each update to handle button clicks

    // Check for coin collection
    coins.forEach(coin => {
        if (!coin.collected && 
            pacman.x < coin.x + 16 && pacman.x + pacman.width > coin.x &&
            pacman.y < coin.y + 16 && pacman.y + pacman.height > coin.y) {
            coin.collected = true;
            if (coin.type === 1) {
                score += 1;
            } else {
                score -= 1;
            }
            // Increase ghost speed based on score
            ghost.speed = 1 + score * 0.05;
        }
    });

    // Move ghost
    if (Math.random() < 0.05) { // Change direction randomly with 5% probability
        const directions = ['up', 'down', 'left', 'right'];
        ghost.dir = directions[Math.floor(Math.random() * directions.length)];
    }

    let ghostNewX = ghost.x;
    let ghostNewY = ghost.y;

    switch (ghost.dir) {
        case 'up':
            ghostNewY -= ghost.speed;
            break;
        case 'down':
            ghostNewY += ghost.speed;
            break;
        case 'left':
            ghostNewX -= ghost.speed;
            break;
        case 'right':
            ghostNewX += ghost.speed;
            break;
    }

    // Check if the new position collides with any walls for the ghost
    let ghostCollidesWithWall = squares.some(square => {
        return ghostNewX < square.x + 32 &&
               ghostNewX + ghost.width > square.x &&
               ghostNewY < square.y + 32 &&
               ghostNewY + ghost.height > square.y;
    });

    // If there is no collision with any wall, update the ghost's position
    if (!ghostCollidesWithWall) {
        ghost.x = ghostNewX;
        ghost.y = ghostNewY;
    }

    // Check if the ghost collides with boundary walls
    ghost.x = Math.max(0, Math.min(ghost.x, canvas.width - ghost.width));
    ghost.y = Math.max(0, Math.min(ghost.y, canvas.height - ghost.height));

    // Check for collision with ghost
    if (checkGhostCollision()) {
        gameOver = true;
    }
    // Check score
    if (score < 0) {
	    gameOver = true;
	}
	// Increase ghost speed based on score
	if (score > 0) {
		ghost.speed = 1 + score * 0.2; // Adjust the multiplier as needed
	}
	if (!gameOver) {
        currentTime = Math.floor((Date.now() - startTime) / 1000); // Update the current time
    }
	
}



// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw squares
    ctx.fillStyle = '#558A36';
    squares.forEach(square => {
        ctx.fillRect(square.x, square.y, square.width, square.height);
    });

    // Draw Pac-Man
    ctx.drawImage(pacmanImage, pacman.x, pacman.y, pacman.width, pacman.height);

    // Draw ghost
    ctx.drawImage(ghostImage, ghost.x, ghost.y, ghost.width, ghost.height);

    // Draw coins
    coins.forEach(coin => {
        if (!coin.collected) {
            if (coin.type === 1) {
                ctx.drawImage(coin1Image, coin.x, coin.y, 16, 16);
            } else {
                ctx.drawImage(coin2Image, coin.x, coin.y, 16, 16);
            }
        }
    });

    // Display score at the top
    ctx.fillStyle = '#fff';
    ctx.font = '15px Comic Sans MS';
    ctx.textAlign = 'left'; // Align left for Nuggies
    ctx.fillText('Nuggies: ' + score, 10, 20); // Left aligned

    ctx.textAlign = 'center'; // Align center for Time
    ctx.fillText('Time: ' + currentTime + 's', canvas.width / 2, 20); // Center aligned

    ctx.textAlign = 'right'; // Align right for Mommy
    ctx.fillText('Mommy: ' + ghost.speed.toFixed(2), canvas.width - 10, 20); // Right aligned

    // Display Game Over message
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 , canvas.height / 2);

        // Draw reload button
        ctx.fillStyle = '#fff';
        ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 50);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Try again', canvas.width / 2, canvas.height / 2 + 85);

        // Add event listener to reload button
        canvas.addEventListener('click', function(event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (mouseX >= canvas.width / 2 - 50 && mouseX <= canvas.width / 2 + 50 &&
                mouseY >= canvas.height / 2 + 50 && mouseY <= canvas.height / 2 + 100) {
                window.location.reload();
            }
        });
    }
}




// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game loop when images are loaded
pacmanImage.onload = () => {
    ghostImage.onload = () => {
        coin1Image.onload = () => {
            coin2Image.onload = () => {
                // Wait for images to load before starting the game loop
                // Draw start screen
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = '40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Press Start to Play', canvas.width / 2, canvas.height / 2);
                ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

                // Enable start button
                startButton.disabled = false;
            };
        };
    };
};

// Handle button clicks for character movement
document.getElementById('up').addEventListener('click', () => {
    moveCharacter('up');
});

document.getElementById('down').addEventListener('click', () => {
    moveCharacter('down');
});

document.getElementById('left').addEventListener('click', () => {
    moveCharacter('left');
});

document.getElementById('right').addEventListener('click', () => {
    moveCharacter('right');
});

// Function to move the character based on button clicks
function moveCharacter(direction) {
    let newX = pacman.x;
    let newY = pacman.y;

    // Calculate the new position based on the direction
    switch (direction) {
        case 'up':
            newY -= pacman.speed;
            break;
        case 'down':
            newY += pacman.speed;
            break;
        case 'left':
            newX -= pacman.speed;
            break;
        case 'right':
            newX += pacman.speed;
            break;
    }

    // Check if the new position collides with any walls
    let collidesWithWall = squares.some(square => {
        return newX < square.x + 32 &&
               newX + pacman.width > square.x &&
               newY < square.y + 32 &&
               newY + pacman.height > square.y;
    });

    // If there is no collision with any wall, update the character's position
    if (!collidesWithWall) {
        pacman.x = Math.max(0, Math.min(newX, canvas.width - pacman.width));
        pacman.y = Math.max(0, Math.min(newY, canvas.height - pacman.height));
    }
}

