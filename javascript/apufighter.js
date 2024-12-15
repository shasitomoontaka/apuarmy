document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const levelDisplay = document.getElementById('level');
    const loadingMessage = document.getElementById('loading');
    const startButton = document.getElementById('start-button');
    const preGameImage = document.getElementById('pre-game-image');
    const timerDisplay = document.getElementById('timer');
    const baseGravity = 0.69;
    const maxGravityVariation = 0.2;
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const jumpBtn = document.getElementById('jump-btn');
    const shootBtn = document.getElementById('shoot-btn');

    
    let projectileGravity = baseGravity;
    let timerInterval;
    let startTime;
    let level = 1;
    let playerHealth = 100;
    let enemyHealth = 100;
    let enemySpeed = 1;
    let playerPosition = { x: 10, y: 10, isJumping: false, jumpVelocity: 0 };
    let enemyPosition = { x: 80, y: 10, isJumping: false, jumpVelocity: 0 };
    let projectiles = [];
    let enemyProjectiles = [];
    let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false };
    let gameLoop;
    let lastShotTime = 0;
    let lastEnemyShotTime = 0; // Track the last enemy shot time
	const enemyShotCooldown = 420;
    const shotCooldown = 69; // Cooldown for player shooting (1 second)
    const gravity = 0.69;
    const jumpHeight = 6.9;
    const groundLevel = 10;

    const enemyImages = [
        'images/apufighter/enemy1.png',
        '../images/apufighter/enemy2.png',
        '../images/apufighter/enemy3.png',
        '../images/apufighter/enemy4.png',
        '../images/apufighter/enemy5.png',
        '../images/apufighter/enemy6.png',
        '../images/apufighter/enemy7.png',
        '../images/apufighter/enemy8.png',
        '../images/apufighter/enemy9.png',
        '../images/apufighter/enemy10.png'
    ];

    // Preload images
    function preloadImages(urls, allImagesLoadedCallback) {
        let loadedCounter = 0;
        const toBeLoadedNumber = urls.length;

        urls.forEach(function(url) {
            preloadImage(url, function () {
                loadedCounter++;
                if (loadedCounter === toBeLoadedNumber) {
                    allImagesLoadedCallback();
                }
            });
        });

        function preloadImage(url, anImageLoadedCallback) {
            let img = new Image();
            img.onload = anImageLoadedCallback;
            img.onerror = () => anImageLoadedCallback();
            img.src = url;
        }
    }

	function showStartScreen() {
		preGameImage.style.display = 'block';
		startButton.style.display = 'block';
		timerDisplay.style.display = 'none';
		player.style.display = 'none'; // Hide the player
		document.getElementById('mobile-controls').style.display = 'none'; // Hide mobile controls
		if (currentEnemy) {
			currentEnemy.style.display = 'none'; // Hide the enemy
		}
	}

	function startGame() {
		preGameImage.style.display = 'none';
		startButton.style.display = 'none';
		timerDisplay.style.display = 'block';
		player.style.display = 'block'; // Show the player
	
		startTime = Date.now();
		timerInterval = setInterval(updateTimer, 1000);
		initGame();
	}

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime}s`;
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function createEnemy() {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.backgroundImage = `url('${enemyImages[level - 1]}')`;
        gameContainer.appendChild(enemy);
        return enemy;
    }

    let currentEnemy;

    function updatePositions() {
        player.style.left = `${playerPosition.x}%`;
        player.style.bottom = `${playerPosition.y}%`;
        currentEnemy.style.right = `${100 - enemyPosition.x}%`;
        currentEnemy.style.bottom = `${enemyPosition.y}%`;
    }

    function movePlayer(direction) {
        const speed = 1;
        if (direction === 'left' && playerPosition.x > 0) {
            playerPosition.x -= speed;
        } else if (direction === 'right' && playerPosition.x < 90) {
            playerPosition.x += speed;
        }
    }

    function moveEnemy() {
        let rightLimit = 90;
        let leftLimit = 80 - (level - 1) * 5;

        if (leftLimit < 50) {
            leftLimit = 50;
        }

        let changeDirectionChance = 0.05;
        if (level > 1 && level <= 5) {
            changeDirectionChance = 0.1 + (level - 1) * 0.02;
        } else if (level > 5 && level <= 10) {
            changeDirectionChance = 0.1 + (level - 6) * 0.01;
        }

        enemyPosition.x += enemySpeed;

        if (enemyPosition.x < leftLimit) {
            enemyPosition.x = leftLimit;
        } else if (enemyPosition.x > rightLimit) {
            enemyPosition.x = rightLimit;
        }

        if (Math.random() < changeDirectionChance) {
            enemySpeed *= -1;
        }
    }

    function jumpPlayer() {
        if (!playerPosition.isJumping) {
            playerPosition.isJumping = true;
            playerPosition.jumpVelocity = jumpHeight;
        }
    }

    function jumpEnemy() {
        if (!enemyPosition.isJumping) {
            enemyPosition.isJumping = true;
            enemyPosition.jumpVelocity = jumpHeight;
        }
    }

    function applyGravity() {
        if (playerPosition.isJumping) {
            playerPosition.y += playerPosition.jumpVelocity;
            playerPosition.jumpVelocity -= gravity;
            if (playerPosition.y <= groundLevel) {
                playerPosition.y = groundLevel;
                playerPosition.isJumping = false;
            }
        }

        if (enemyPosition.isJumping) {
            enemyPosition.y += enemyPosition.jumpVelocity;
            enemyPosition.jumpVelocity -= gravity;
            if (enemyPosition.y <= groundLevel) {
                enemyPosition.y = groundLevel;
                enemyPosition.isJumping = false;
            }
        }
    }

    function shoot(isPlayer) {
        const currentTime = Date.now();
        if (isPlayer && currentTime - lastShotTime < shotCooldown) {
            return;
        }

        const projectile = document.createElement('div');
        projectile.className = 'projectile';
        projectile.style.backgroundImage = isPlayer ? "url('images/apufighter/player-projectile.png')" : "url('images/apufighter/enemy-projectile.png')";

        if (isPlayer) {
            projectile.style.left = `${playerPosition.x + 2}%`;
            projectile.style.bottom = `${playerPosition.y + 5}%`;
            projectiles.push(projectile);
            lastShotTime = currentTime;
        } else {
            projectile.style.left = `${enemyPosition.x - 2}%`;
            projectile.style.bottom = `${enemyPosition.y + 5}%`;
            enemyProjectiles.push(projectile);
        }

        gameContainer.appendChild(projectile);
    }
    
    function updateProjectileGravity() {
        const randomFactor = Math.random() * 2 - 2; // Random number between -1 and 1
        const variation = maxGravityVariation * randomFactor;
        projectileGravity = baseGravity + variation;
    }

    function moveProjectiles() {
        const updateFrequency = 0.1 + (level - 1) * 0.05; // Increase frequency with level
        if (Math.random() < updateFrequency) {
            updateProjectileGravity();
        }

        projectiles.forEach((projectile, index) => {
            const currentLeft = parseFloat(projectile.style.left);
            const currentBottom = parseFloat(projectile.style.bottom);

            projectile.style.bottom = `${currentBottom - projectileGravity}%`;

            if (currentLeft > 100 || currentBottom <= groundLevel) {
                projectile.remove();
                projectiles.splice(index, 1);
            } else {
                projectile.style.left = `${currentLeft + 2}%`;
            }
        });

        enemyProjectiles.forEach((projectile, index) => {
            const currentLeft = parseFloat(projectile.style.left);
            const currentBottom = parseFloat(projectile.style.bottom);

            projectile.style.bottom = `${currentBottom - projectileGravity}%`;

            if (currentLeft < 0 || currentBottom <= groundLevel) {
                projectile.remove();
                enemyProjectiles.splice(index, 1);
            } else {
                projectile.style.left = `${currentLeft - 2}%`;
            }
        });
    }

    function checkCollisions() {
        projectiles.forEach((projectile, index) => {
            const projectileRect = projectile.getBoundingClientRect();
            const enemyRect = currentEnemy.getBoundingClientRect();
            if (
                projectileRect.right >= enemyRect.left &&
                projectileRect.left <= enemyRect.right &&
                projectileRect.bottom >= enemyRect.top &&
                projectileRect.top <= enemyRect.bottom
            ) {
                enemyHealth -= 10;
                projectile.remove();
                projectiles.splice(index, 1);
                updateHUD();
                checkLevelUp();
            }
        });

        enemyProjectiles.forEach((projectile, index) => {
            const projectileRect = projectile.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();
            if (
                projectileRect.right >= playerRect.left &&
                projectileRect.left <= playerRect.right &&
                projectileRect.bottom >= playerRect.top &&
                projectileRect.top <= playerRect.bottom
            ) {
                playerHealth -= 10;
                projectile.remove();
                enemyProjectiles.splice(index, 1);
                updateHUD();
                checkGameOver();
            }
        });
    }

	function updateHUD() {
		levelDisplay.textContent = `Level: ${level}`;
		
		const playerHealthPercentage = Math.max(playerHealth, 0) / 100 * 100;
		document.getElementById('player-health-bar-inner').style.width = `${playerHealthPercentage}%`;
		
		const enemyMaxHealth = 100 + (level - 1) * 10;
		const enemyHealthPercentage = Math.max(enemyHealth, 0) / enemyMaxHealth * 100;
		document.getElementById('enemy-health-bar-inner').style.width = `${enemyHealthPercentage}%`;
	}


    function checkLevelUp() {
        if (enemyHealth <= 0) {
            level++;
            if (level > 10) {
                alert('Congratulations! You won the game!');
                stopTimer();
                resetGame();
            } else {
                enemyHealth = 100 + (level - 1) * 10;
                enemySpeed = 0.5 + (level - 5) * 0.01;
                currentEnemy.remove();
                currentEnemy = createEnemy();
                updateHUD();
            }
        }
    }

	function checkGameOver() {
		if (playerHealth <= 0) {
			playerHealth = 0; // Ensure health doesn't go below 0
			updateHUD(); // Update the HUD to show 0 health
			stopTimer();
			clearInterval(gameLoop); // Stop the game loop
			setTimeout(handleGameOver, 500); // Delay to allow the player to see the 0 health
		}
	}
	
	function handleGameOver() {
		alert('Game Over! Try again.');
		resetGame();
	}
	
	function resetGame() {
		// Reset game variables
		level = 1;
		playerHealth = 100;
		enemyHealth = 100;
		enemySpeed = 1;
		playerPosition = { x: 10, y: 10, isJumping: false, jumpVelocity: 0 };
		enemyPosition = { x: 80, y: 10, isJumping: false, jumpVelocity: 0 };
		
		// Clear projectiles
		projectiles.forEach(p => p.remove());
		enemyProjectiles.forEach(p => p.remove());
		projectiles = [];
		enemyProjectiles = [];
		
		projectileGravity = baseGravity;
		
		// Remove the current enemy
		if (currentEnemy) {
			currentEnemy.remove();
			currentEnemy = null;
		}
		
		// Reset UI elements
		timerDisplay.textContent = 'Time: 0s';
		updateHUD();
		
		// Clear any existing game loop
		clearInterval(gameLoop);
		
		// Show the start screen
		showStartScreen();
	}

    function gameUpdate() {
        if (keys.ArrowLeft) movePlayer('left');
        if (keys.ArrowRight) movePlayer('right');
        if (keys.ArrowUp) jumpPlayer();
        applyGravity();
        moveEnemy();
        moveProjectiles();
        updatePositions();
        checkCollisions();

		const currentTime = Date.now();
		if (Math.random() < 0.05 + level * 0.01 && currentTime - lastEnemyShotTime >= enemyShotCooldown) {
			shoot(false); // Enemy shoots
			lastEnemyShotTime = currentTime; // Update the last shot time
            if (Math.random() < 0.5 + level * 0.05) jumpEnemy();
        }
    }
    
        function handleTouchStart(e) {
        e.preventDefault();
        const button = e.target;
        if (button.id === 'left-btn') keys.ArrowLeft = true;
        if (button.id === 'right-btn') keys.ArrowRight = true;
        if (button.id === 'jump-btn') keys.ArrowUp = true;
        if (button.id === 'shoot-btn') shoot(true);
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        const button = e.target;
        if (button.id === 'left-btn') keys.ArrowLeft = false;
        if (button.id === 'right-btn') keys.ArrowRight = false;
        if (button.id === 'jump-btn') keys.ArrowUp = false;
    }

    leftBtn.addEventListener('touchstart', handleTouchStart);
    rightBtn.addEventListener('touchstart', handleTouchStart);
    jumpBtn.addEventListener('touchstart', handleTouchStart);
    shootBtn.addEventListener('touchstart', handleTouchStart);

    leftBtn.addEventListener('touchend', handleTouchEnd);
    rightBtn.addEventListener('touchend', handleTouchEnd);
    jumpBtn.addEventListener('touchend', handleTouchEnd);

    // Prevent default touch behavior to avoid scrolling
    document.getElementById('mobile-controls').addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    function initGame() {
        preloadImages([
            '../images/apufighter/background.jpg', '../images/apufighter/player.png', '../images/apufighter/player-projectile.png', '../images/apufighter/enemy-projectile.png',
            ...enemyImages
        ], () => {
            loadingMessage.style.display = 'none';
			document.getElementById('mobile-controls').style.display = 'flex'; // Show mobile controls
            currentEnemy = createEnemy();
            updateHUD();
            gameLoop = setInterval(gameUpdate, 1000 / 30); // 30 FPS
        });
    }

    // Event listeners
    document.addEventListener('keydown', (e) => {
        if (e.code in keys) keys[e.code] = true;
        if (e.code === 'Space') shoot(true);
				// Prevent default action for arrow keys and space bar
		if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
			e.preventDefault();
		}
	
		if (e.code in keys) keys[e.code] = true;
		if (e.code === 'Space') shoot(true);

    });

    document.addEventListener('keyup', (e) => {
        if (e.code in keys) keys[e.code] = false;
    });

    startButton.addEventListener('click', startGame);

    showStartScreen(); // Show the start screen initially
});
