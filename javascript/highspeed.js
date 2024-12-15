document.addEventListener('DOMContentLoaded', () => {
    const rows = 10;
    const cols = 20;
    let playerPosition = { row: rows - 1, col: 1 };
    let playerSize = { width: 1, height: 1 };
    let blocks = [];
    let collectibles = [];
    let gameInterval;
    let timerInterval;
    let timeElapsed = 0;
    let score = 0;
    let isGameRunning = false;
    let sizePowerupTimeout = null;

    const gameTable = document.getElementById('gameTable');
    const startButton = document.getElementById('startButton');
    const retryButton = document.getElementById('retryButton');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');

    function createTable() {
        gameTable.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c < cols; c++) {
                const td = document.createElement('td');
                td.dataset.row = r;
                td.dataset.col = c;
                tr.appendChild(td);
            }
            gameTable.appendChild(tr);
        }
    }

    function drawPlayer() {
        const cells = gameTable.getElementsByTagName('td');
        // Remove all player classes first
        for (let cell of cells) {
            cell.classList.remove('player', 'player-top-left', 'player-top-right', 'player-bottom-left', 'player-bottom-right');
        }

        if (playerSize.width === 1 && playerSize.height === 1) {
            // Single cell player
            gameTable.rows[playerPosition.row].cells[playerPosition.col].classList.add('player');
        } else {
            // Multi-cell player (2x2)
            for (let r = playerPosition.row; r > playerPosition.row - playerSize.height; r--) {
                for (let c = playerPosition.col; c > playerPosition.col - playerSize.width; c--) {
                    if (r >= 0 && r < rows && c >= 0 && c < cols) {
                        const cell = gameTable.rows[r].cells[c];
                        if (r === playerPosition.row && c === playerPosition.col) {
                            cell.classList.add('player-bottom-right');
                        } else if (r === playerPosition.row && c === playerPosition.col - 1) {
                            cell.classList.add('player-bottom-left');
                        } else if (r === playerPosition.row - 1 && c === playerPosition.col) {
                            cell.classList.add('player-top-right');
                        } else if (r === playerPosition.row - 1 && c === playerPosition.col - 1) {
                            cell.classList.add('player-top-left');
                        }
                    }
                }
            }
        }
    }

    function drawElements() {
        const cells = gameTable.getElementsByTagName('td');
        for (let cell of cells) {
            cell.classList.remove('red-block', 'collectible', 'negative-collectible', 'black-block', 'purple-collectible', 'grey-block', 'yellow-block');
        }
        blocks.forEach(block => {
            if (block.col >= 0 && block.col < cols) {
                gameTable.rows[block.row].cells[block.col].classList.add(`${block.type}-block`);
            }
        });
        collectibles.forEach(collectible => {
            if (collectible.col >= 0 && collectible.col < cols) {
                const className = collectible.type === 'positive' ? 'collectible' : 
                                collectible.type === 'negative' ? 'negative-collectible' : 
                                'purple-collectible';
                gameTable.rows[collectible.row].cells[collectible.col].classList.add(className);
            }
        });
    }

    function movePlayer(direction) {
        const newPosition = { ...playerPosition };
        switch (direction) {
            case 'up': newPosition.row = Math.max(0, playerPosition.row - 1); break;
            case 'down': newPosition.row = Math.min(rows - playerSize.height + 1, playerPosition.row + 1); break;
            case 'left': newPosition.col = Math.max(0, playerPosition.col - 1); break;
            case 'right': newPosition.col = Math.min(cols - playerSize.width + 1, playerPosition.col + 1); break;
        }
        if (!isBlocked(newPosition.row, newPosition.col)) {
            playerPosition = newPosition;
            drawPlayer();
            checkCollectible();
        }
    }

    function isBlocked(row, col) {
        return blocks.some(block => block.row === row && block.col === col);
    }

    function updateGame() {
        const blockFrequency = 0.1 + (score * 0.01);
        const collectibleFrequency = 0.1 + (score * 0.01);

        blocks = blocks.filter(block => --block.col >= 0);
        collectibles = collectibles.filter(collectible => --collectible.col >= 0);

        if (Math.random() < blockFrequency) {
            const blockTypes = ['red', 'black', 'grey', 'yellow'];
            const weights = [0.7, 0.1, 0.1, 0.1]; // 70% red, 10% each for others
            let random = Math.random();
            let selectedType;
            
            for (let i = 0; i < weights.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    selectedType = blockTypes[i];
                    break;
                }
            }
            
            blocks.push({ row: Math.floor(Math.random() * rows), col: cols - 1, type: selectedType });
        }

        if (Math.random() < collectibleFrequency) {
            const type = Math.random() < 0.33 ? 'positive' : (Math.random() < 0.5 ? 'negative' : 'purple');
            collectibles.push({ row: Math.floor(Math.random() * rows), col: cols - 1, type: type });
        }

        drawElements();
        checkCollision();
        checkCollectible();
    }

    function checkCollision() {
        // Check each cell that the player occupies
        for (let r = playerPosition.row; r > playerPosition.row - playerSize.height; r--) {
            for (let c = playerPosition.col; c > playerPosition.col - playerSize.width; c--) {
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    // Check for collision with blocks
                    const collidingBlock = blocks.find(block => block.row === r && block.col === c);
                    if (collidingBlock) {
                        if (collidingBlock.type === 'grey') {
                            activateSizePowerup();
                            blocks = blocks.filter(b => b !== collidingBlock);
                        } else if (collidingBlock.type === 'yellow') {
                            handleYellowBlock();
                            blocks = blocks.filter(b => b !== collidingBlock);
                        } else {
                            playerPosition.col--;
                            if (playerPosition.col < playerSize.width - 1) {
                                gameOver();
                                return;
                            }
                        }
                    }
                }
            }
        }
        drawPlayer();
    }

    function activateSizePowerup() {
        if (sizePowerupTimeout) {
            clearTimeout(sizePowerupTimeout);
        }
        
        playerSize = { width: 2, height: 2 };
        drawPlayer();
        
        sizePowerupTimeout = setTimeout(() => {
            playerSize = { width: 1, height: 1 };
            drawPlayer();
        }, 5000);
    }

    function handleYellowBlock() {
        const effects = [
            () => teleportPlayer(), // Purple effect
            () => { score++; updateScore(); }, // Positive effect
            () => { score--; updateScore(); }, // Negative effect
            () => activateSizePowerup(), // Grey effect
            () => { // Red block effect
                playerPosition.col--;
                if (playerPosition.col < playerSize.width - 1) {
                    gameOver();
                    return;
                }
                drawPlayer();
            },
            () => gameOver() // Black block effect
        ];
        
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
    }

    function checkCollectible() {
        const collectibleIndexesToRemove = [];

        // Check each cell that the player occupies
        for (let r = playerPosition.row; r > playerPosition.row - playerSize.height; r--) {
            for (let c = playerPosition.col; c > playerPosition.col - playerSize.width; c--) {
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    // Find any collectible at this position
                    const collectibleIndex = collectibles.findIndex(
                        collectible => collectible.row === r && collectible.col === c
                    );

                    if (collectibleIndex !== -1) {
                        const collectible = collectibles[collectibleIndex];
                        switch (collectible.type) {
                            case 'positive':
                                score++;
                                break;
                            case 'negative':
                                score--;
                                break;
                            case 'purple':
                                // Store the index for removal but don't teleport yet
                                collectibleIndexesToRemove.push(collectibleIndex);
                                // We'll teleport after removing all collectibles
                                setTimeout(teleportPlayer, 0);
                                break;
                        }
                        if (!collectibleIndexesToRemove.includes(collectibleIndex)) {
                            collectibleIndexesToRemove.push(collectibleIndex);
                        }
                        updateScore();
                    }
                }
            }
        }

        // Remove collectibles in reverse order to maintain correct indices
        collectibleIndexesToRemove.sort((a, b) => b - a).forEach(index => {
            collectibles.splice(index, 1);
        });

        if (score < 0) gameOver();
    }

    function teleportPlayer() {
        do {
            playerPosition = {
                row: Math.floor(Math.random() * (rows - playerSize.height + 1)),
                col: Math.floor(Math.random() * (cols - playerSize.width + 1))
            };
        } while (isBlocked(playerPosition.row, playerPosition.col));
        drawPlayer();
    }

    function updateTimer() {
        timerDisplay.textContent = `Time: ${++timeElapsed}s`;
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function startGame() {
        isGameRunning = true;
        gameTable.classList.remove('hidden');
        startButton.classList.add('hidden');
        retryButton.classList.add('hidden');
        timeElapsed = 0;
        score = 0;
        playerSize = { width: 1, height: 1 };
        playerPosition = { row: rows - 1, col: 1 };
        blocks = [];
        collectibles = [];
        if (sizePowerupTimeout) {
            clearTimeout(sizePowerupTimeout);
        }
        updateTimer();
        updateScore();
        drawPlayer();
        drawElements();
        gameInterval = setInterval(updateGame, 200);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function gameOver() {
        isGameRunning = false;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        if (sizePowerupTimeout) {
            clearTimeout(sizePowerupTimeout);
        }
        retryButton.classList.remove('hidden');
    }
	function handleKeyPress(event) {
			if (!isGameRunning) return;
			
			// Prevent default behavior for game control keys
			if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
				event.preventDefault();
			}
			
			// Handle movement
			if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
				movePlayer(event.key.replace('Arrow', '').toLowerCase());
			}
    }

    createTable();
    startButton.addEventListener('click', startGame);
    retryButton.addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);
});