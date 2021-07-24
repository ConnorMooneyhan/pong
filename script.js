// Fixed variables
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const paddleWidth = canvas.width / 48;
const paddleHeight = canvas.height / 3.2;
const ballRadius = 8;
const paddleSpeed = 2;
const ballSpeed = 4;
const goalScore = 3;

// Flexible variables
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;
let running = true;
let winner = undefined;
let leftName = 'Player 1';
let rightName = 'Player 2';

// Class definitions
class Paddle {
  constructor(x, y) {
    this.initialX = x;
    this.x = x;
    this.initialY = y;
    this.y = y;
    this.width = paddleWidth;
    this.height = paddleHeight;
    this.dy = 0;
  }

  initialize() {
    this.x = this.initialX;
    this.y = this.initialY;
  }

  update(up, down) {
    this.dy = 0;

    if (up && this.y + this.dy > 0) {
      this.dy = -paddleSpeed;
    } else if (down && this.y + this.dy < canvas.height - this.height) {
      this.dy = paddleSpeed;
    }

    this.y += this.dy;
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ball {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = ballRadius;
    this.dx = Math.random() < 0.5 ? -ballSpeed : ballSpeed;
    this.dy = -ballSpeed;
  }

  initialize() {
    running = true;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.dx = Math.random() < 0.5 ? -ballSpeed : ballSpeed;
    this.dy = -ballSpeed;
  }

  update() {
    if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
      if (this.x + this.dx > canvas.width - this.radius) {
        leftScoreboard.score++;
        this.dx = canvas.width - this.radius - this.x;
        this.dy = canvas.width - this.radius - this.x;
      } else {
        rightScoreboard.score++;
        this.dx = -(this.x - this.radius);
        this.dy = -(this.x - this.radius);
      }
      this.x += this.dx;
      this.y += this.dy;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw();
      if (leftScoreboard.score < goalScore && rightScoreboard.score < goalScore) {
        running = false;
        setTimeout(this.initialize.bind(this), 1000);
        setTimeout(gameLoop, 1000);
      } else {
        endGame();
        return;
      }
    }
    if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }
    if (this.x + this.dx - this.radius < leftPaddle.width && this.y + this.dy > leftPaddle.y && this.y + this.dy < leftPaddle.y + leftPaddle.height) {
      this.dx = -this.dx;
    } else if (this.x + this.dx + this.radius > rightPaddle.x && this.y + this.dy > rightPaddle.y && this.y + this.dy < rightPaddle.y + rightPaddle.height) {
      this.dx = -this.dx;
    }
    
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }
}

class Scoreboard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.score = 0;
  }

  initialize() {
    this.score = 0;
  }

  draw() {
    ctx.font = '24px serif';
    ctx.textAlign = 'center'
    ctx.fillText(this.score, this.x, this.y);
  }
}

// Object definitions
const leftPaddle = new Paddle(0, (canvas.height - paddleHeight) / 2);
const rightPaddle = new Paddle(canvas.width - paddleWidth, (canvas.height - paddleHeight) / 2);
const ball1 = new Ball();
const leftScoreboard = new Scoreboard(18, 29);
const rightScoreboard = new Scoreboard(canvas.width - 18, 29);

function initialize() {
  leftPaddle.initialize();
  rightPaddle.initialize();
  ball1.initialize();
  leftScoreboard.initialize();
  rightScoreboard.initialize();
}

// Handler for starting game with space bar
function startWithSpace(e) {
  if (e.key === " ") {
    running = true;
    initialize();
    gameLoop();
  }
}

// Start screen
function startScreen() {
  let fontSize = 30;
  ctx.fillStyle = 'hsla(0, 0%, 80%, .8)';
  ctx.textAlign = 'center';
  ctx.font = `${fontSize}px serif`;
  ctx.fillText('Pong', canvas.width / 2, canvas.height / 2 - fontSize * 1.5);
  ctx.fillText('Player 1:', canvas.width / 2, canvas.height / 2 - fontSize * .5);
  ctx.fillText('Player 2:', canvas.width / 2, canvas.height / 2 + fontSize * .5)
  ctx.fillText('Press spacebar to start game', canvas.width / 2, canvas.height / 2 + fontSize * 1.5);

  canvas.addEventListener('keydown', startWithSpace, {once:true});
}

// Re-assign variables for new game state
function update() {
  leftPaddle.update(wPressed, sPressed);
  rightPaddle.update(upPressed, downPressed);
  ball1.update();
}

// Display winner after game ends
function displayWinner() {
  ctx.fillStyle = 'hsla(0, 0%, 80%, .8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(`${winner} wins!`, canvas.width / 2, canvas.height / 2);
}

// End the game
function endGame() {
  running = false;
  if (leftScoreboard.score >= goalScore) {
    winner = leftName;
  } else {
    winner = rightName;
  }
  displayWinner();
  canvas.addEventListener('keydown', startWithSpace, {once:true});
}

// Draw all game objects
function draw() {
  leftPaddle.draw();
  rightPaddle.draw();
  ball1.draw();
  leftScoreboard.draw();
  rightScoreboard.draw();
}

// Run entire game loop: update state, clear canvas, draw frame
function gameLoop() {
  update();

  if (!running) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  draw();
  
  requestAnimationFrame(gameLoop);
}

// Display start screen
startScreen();

// Detect keydown events
window.addEventListener('keydown', e => {
  if (e.key === 'w') {
    wPressed = true;
  } else if (e.key === 's') {
    sPressed = true;
  } else if (e.key === 'ArrowUp') {
    upPressed = true;
  } else if (e.key === 'ArrowDown') {
    downPressed = true;
  }
});

// Detect keyup events
window.addEventListener('keyup', e => {
  if (e.key === 'w') {
    wPressed = false;
  } else if (e.key === 's') {
    sPressed = false;
  } else if (e.key === 'ArrowUp') {
    upPressed = false;
  } else if (e.key === 'ArrowDown') {
    downPressed = false;
  }
});