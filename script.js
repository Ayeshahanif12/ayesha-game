//Define html element 
const board = document.getElementById('gameBoard');
const instructionText = document.getElementById('instruction-text');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');


//define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//draw game map,snake,food
function draw() {

    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//draw snake 
function drawSnake() {

    snake.forEach(segment => {
        const snakeElement = createGameElement('div',
            'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}
// create snake or food/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}
// set the position of snake and food
function setPosition(element, position) {

    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}
//testing
//draw();

//draw food function 
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


//moving the snake 
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;

    }
}
//snake.unshift(head);
// snake.pop();

if (head.x === food.x && head.y === food.y) {
    generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        checkcollisions();
        draw();

    }, gameSpeedDelay);
} else {
    snake.unshift(head);
    snake.pop();

}
if (checkcollisions()) {
    resetGame();
} else {
    draw();
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

function checkcollisions() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
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
//setInterval(()=>{
//move();   //move first 
//draw();   // draw again new position 

//},200);

//start the game 
function startGame() {

    gameStarted = true; // keep track of the game 
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(move, gameSpeedDelay);
}
//keypress event listener 
function handleKeyPress(event) {
    if
        (!gameStarted && event.code === 'space') {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}
document.addEventListener('keydown', handleKeyPress);


function checkcollisions() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}



function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}
function startGame() {

    gameStarted = true; // keep track of the game 
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(move, gameSpeedDelay);
}
//keypress event listener 
function handleKeyPress(event) {
    if
        (!gameStarted && event.code === 'space') {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}
document.addEventListener('keydown', handleKeyPress);


function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = currentScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}