const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const leftScoreElement = document.getElementById('leftScore');
const rightScoreElement = document.getElementById('rightScore');
const winMessageElement = document.getElementById('winMessage');
const winnerElement = document.getElementById('winner');
const restartButton = document.getElementById('restartButton');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let paddleSpeed = 4;
let ballSpeedX = 5;
let ballSpeedY = 3;

const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: ballSpeedX,
    dy: ballSpeedY
};

let leftScore = 0;
let rightScore = 0;
let gameOver = false;

function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    leftScoreElement.textContent = `Player 1: ${leftScore}`;
    rightScoreElement.textContent = `Player 2: ${rightScore}`;
}

function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Keep paddles within canvas
    leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - paddleHeight), 0);
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - paddleHeight), 0);
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (ball.x - ball.size < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height) {
        ball.dx = -ball.dx;
    }

    if (ball.x + ball.size > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height) {
        ball.dx = -ball.dx;
    }

    // Ball out of bounds
    if (ball.x - ball.size < 0) {
        rightScore++;
        if (rightScore === 5) {
            gameOver = true;
            showWinMessage(2);
        } else {
            resetBall();
        }
    }
    if (ball.x + ball.size > canvas.width) {
        leftScore++;
        if (leftScore === 5) {
            gameOver = true;
            showWinMessage(1);
        } else {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeedX * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeedY * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    if (!gameOver) {
        movePaddles();
        moveBall();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
    drawScore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function showWinMessage(player) {
    winnerElement.textContent = player;
    winMessageElement.classList.remove('hidden');
}

function hideWinMessage() {
    winMessageElement.classList.add('hidden');
}

function restartGame() {
    leftScore = 0;
    rightScore = 0;
    gameOver = false;
    hideWinMessage();
    resetBall();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') rightPaddle.dy = -paddleSpeed;
    if (e.key === 'ArrowDown') rightPaddle.dy = paddleSpeed;
    if (e.key === 'w') leftPaddle.dy = -paddleSpeed;
    if (e.key === 's') leftPaddle.dy = paddleSpeed;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') rightPaddle.dy = 0;
    if (e.key === 'w' || e.key === 's') leftPaddle.dy = 0;
});

restartButton.addEventListener('click', restartGame);

gameLoop();