// script.js

const board = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let score = 0;
let highScore = 0;
let gameInterval;
let gameSpeed = 200;
let gameStarted = false;


//Drawing a snake or food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}
//drawSnake
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

//drawing food
function drawFood() {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

//generate food
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

//moving from side
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        food = generateFood();
        increaseScore();
        increaseSpeed();
    } else {
        snake.unshift(head);
        snake.pop();
    }

    if (checkCollisions()) {
        resetGame();
    } else {
        draw();
    }
}

function increaseScore() {
    score++;
    if (score > highScore) {
        highScore = score;
    }
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(move, gameSpeed);
    }
}

function checkCollisions() {
    const head = snake[0];
    return (
        head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function resetGame() {
    score = 0;
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    food = generateFood();
    gameSpeed = 200;
    clearInterval(gameInterval);
    gameInterval = setInterval(move, gameSpeed);
    updateScore();
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(move, gameSpeed);
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        case ' ': startGame(); break; // Space to start the game
    }
}

document.addEventListener('keydown', handleKeyPress);
