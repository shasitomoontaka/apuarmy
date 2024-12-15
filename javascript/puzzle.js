const puzzleBoard = document.getElementById('puzzle-board');
const startButton = document.getElementById('start-button');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const totalScoreDisplay = document.getElementById('total-score');

let level = 1;
const maxLevel = 10;
let timer;
let seconds = 0;
let totalScore = 0;
let pieces = [];
const puzzleSize = 5; // 5x5 puzzle
const imageUrl = 'images/apuzzle/puzzle'; // Base path for images

function createPuzzlePieces() {
    puzzleBoard.innerHTML = '';
    pieces = [];

    const imageSrc = `${imageUrl}${level}.jpg`;
    const boardSize = puzzleBoard.clientWidth; // Dynamic board size
    const pieceSize = boardSize / puzzleSize; // Dynamically calculate the piece size

    for (let i = 0; i < puzzleSize * puzzleSize; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundImage = `url('${imageSrc}')`;
        piece.style.backgroundPosition = `${-(i % puzzleSize) * pieceSize}px ${-Math.floor(i / puzzleSize) * pieceSize}px`;
        piece.style.backgroundSize = `${boardSize}px ${boardSize}px`; // Dynamically set background size
        piece.setAttribute('draggable', true);
        piece.dataset.index = i;
        pieces.push(piece);
    }

    // Shuffle pieces
    pieces.sort(() => Math.random() - 0.5);

    // Add pieces to the puzzle board
    pieces.forEach(piece => puzzleBoard.appendChild(piece));
}


function startTimer() {
    seconds = 0;
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function checkWin() {
    const boardPieces = Array.from(puzzleBoard.children);
    const isComplete = boardPieces.every((piece, index) => {
        return piece.dataset.index == index;
    });

    if (isComplete) {
        stopTimer();
        totalScore += seconds;
        totalScoreDisplay.textContent = totalScore;

        setTimeout(() => {
            if (level < maxLevel) {
                alert(`Congratulations! You completed level ${level} in ${seconds} seconds. Total score: ${totalScore} seconds.`);
                level++;
                levelDisplay.textContent = level;
                startGame();
            } else {
                alert(`Congratulations! You finished the game! Your total score is ${totalScore} seconds.`);
                startButton.style.display = 'inline-block';
            }
        }, 100);
    }
}

function enableDragAndDrop() {
    let draggedPiece = null;

    function dragStart(e) {
        draggedPiece = e.target;
        setTimeout(() => {
            e.target.style.opacity = '0.5'; // Make piece semi-transparent
        }, 0);
    }

    function dragEnd(e) {
        e.target.style.opacity = '1'; // Restore opacity
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const targetPiece = e.target;

        if (targetPiece.classList.contains('puzzle-piece') && targetPiece !== draggedPiece) {
            // Swap the positions of the dragged and target pieces
            const tempIndex = draggedPiece.dataset.index;
            draggedPiece.dataset.index = targetPiece.dataset.index;
            targetPiece.dataset.index = tempIndex;

            const tempBg = draggedPiece.style.backgroundPosition;
            draggedPiece.style.backgroundPosition = targetPiece.style.backgroundPosition;
            targetPiece.style.backgroundPosition = tempBg;

            // Check for win condition
            checkWin();
        }
    }

    // Add event listeners for all pieces
    const allPieces = document.querySelectorAll('.puzzle-piece');
    allPieces.forEach(piece => {
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragend', dragEnd);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', drop);
    });
}

function enableTouchSupport() {
    let touchedPiece = null;
    let initialTouchPos = null;

    function touchStart(e) {
        e.preventDefault(); // Prevent default scrolling on touch
        touchedPiece = e.target;
        initialTouchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchedPiece.style.opacity = '0.5'; // Make piece semi-transparent
        touchedPiece.style.zIndex = '1000';
    }

    function touchMove(e) {
        if (!touchedPiece) return;
        e.preventDefault();

        // Calculate the current touch position
        const currentTouchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        // Move the piece with the touch
        touchedPiece.style.transform = `translate(${currentTouchPos.x - initialTouchPos.x}px, ${currentTouchPos.y - initialTouchPos.y}px)`;
    }

    function touchEnd(e) {
        touchedPiece.style.opacity = '1'; // Restore opacity
        touchedPiece.style.transform = ''; // Reset the transformation
        const targetPiece = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

        if (targetPiece && targetPiece.classList.contains('puzzle-piece') && targetPiece !== touchedPiece) {
            // Swap the positions of the touched and target pieces
            const tempIndex = touchedPiece.dataset.index;
            touchedPiece.dataset.index = targetPiece.dataset.index;
            targetPiece.dataset.index = tempIndex;

            const tempBg = touchedPiece.style.backgroundPosition;
            touchedPiece.style.backgroundPosition = targetPiece.style.backgroundPosition;
            targetPiece.style.backgroundPosition = tempBg;

            // Check for win condition
            checkWin();
        }

        touchedPiece = null;
    }

    // Add event listeners for all pieces
    const allPieces = document.querySelectorAll('.puzzle-piece');
    allPieces.forEach(piece => {
        piece.addEventListener('touchstart', touchStart);
        piece.addEventListener('touchmove', touchMove);
        piece.addEventListener('touchend', touchEnd);
    });
}


function startGame() {
    createPuzzlePieces();
    enableDragAndDrop();
    enableTouchSupport(); // Add touch support here
    startTimer();
    startButton.style.display = 'none';
}

function resetGame() {
    level = 1;
    totalScore = 0;
    levelDisplay.textContent = level;
    totalScoreDisplay.textContent = totalScore;
    startGame();
}


startButton.addEventListener('click', resetGame);

// Initialize the game
createPuzzlePieces();
