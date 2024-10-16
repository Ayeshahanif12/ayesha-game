const board = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const instructionText = document.getElementById('instruction-text');
const snakeLogo= document.getElementById('snakelogo');
const highScoreElement = document.getElementById('highScore');


const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = 'right';
let score = 0;
let gameInterval;
let gameSpeed = 10;
let gameStarted = false;
let food = {x:0, y:0};
let highScore = 0;

//drawing snake
function draw() {
    // Only draw if the game has started
    if (!gameStarted) return;

    // Clear the previous snake segments
    document.querySelectorAll('.snake').forEach(e => e.remove());
    
    // Draw the snake
    drawSnake();
}


function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood(newFood) {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, newFood);
        board.appendChild(foodElement);
    }
}

function generateFood() {
    document.querySelectorAll('.food').forEach(e => e.remove());
    let newFood;
    do {
        
        newFood = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1,
        };
        drawFood({...newFood});
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    return newFood;
}

function move() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (checkCollisions(head)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = {...generateFood()};
        increaseScore();
        increaseSpeed();
    } else {
        snake.pop();
    }

    draw();
}

function increaseScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
    updateHighScore();
}

function increaseSpeed() {
    // Set the minimum speed limit (lower value = faster snake)
    const minimumSpeed = 50;

    // Decrease speed gradually by reducing less with each increase
    if (gameSpeed > minimumSpeed) {
        gameSpeed -= 5; // Adjust this to decrease speed more gradually (was 10)
    }
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        draw();
    }, gameSpeed);
}

function checkCollisions(head) {
    return (
        head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = {...generateFood()};
    direction = 'right';
    gameSpeed = 200;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function stopGame() {
    // Stop the game loop
    clearInterval(gameInterval);

    // Reset game state
    gameStarted = false;

    // Hide the instruction text again
    instructionText.style.display = 'block';

    // Remove the snake from the board when the game ends
    document.querySelectorAll('.snake').forEach(e => e.remove());
}

function updateHighScore() {
    const currentScore = score;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        instructionText.style.display = 'none';
        

        food = {...generateFood()};
        draw();
        gameInterval = setInterval(() => {
            move();
            draw();
        }, gameSpeed);
    }
}

function handleKeyPress(event) {
    if (!gameStarted && event.code === 'Space') {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);
