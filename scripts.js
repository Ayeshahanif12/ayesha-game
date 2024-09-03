const board = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const instructionText = document.getElementById('instruction-text');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let score = 0;
let gameInterval;
let gameSpeed = 200;
let gameStarted = false;

function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
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

function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

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
        food = generateFood();
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
    highScore.textContent =`highScore: ${highScore}`;
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 10;
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
    food = generateFood();
    direction = 'right';
    gameSpeed = 200;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
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
