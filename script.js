// Fixed variables
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const body = document.querySelector('body');
const paddleWidth = canvas.width / 48;
const paddleHeight = canvas.height / 3.2;
const ballRadius = 10;
const paddleSpeed = 5;
const ballSpeed = 6;
const goalScore = 11;

// Flexible variables
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;
let running = true;
let winner = undefined;
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let onStartScreen = true;

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
    // Detect goal
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

    // Detect collisions
    // Collide with top and bottom
    if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }
    // Collide with fronts of paddles
    if (this.x + this.dx - this.radius < leftPaddle.width && this.y + this.dy > leftPaddle.y && this.y + this.dy < leftPaddle.y + leftPaddle.height) {
      if (this.x > leftPaddle.width) {
        this.dx = -this.dx;
      } else {
        this.dy = -this.dy;
      }
    } else if (this.x + this.dx + this.radius > rightPaddle.x && this.y + this.dy > rightPaddle.y && this.y + this.dy < rightPaddle.y + rightPaddle.height) {
      if (this.x < canvas.width - rightPaddle.width) {
        this.dx = -this.dx;
      } else {
        this.dy = -this.dy;
      }
    }
    
    // Increment position
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

// Initialize game elements
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
    if (onStartScreen) {
      const playerInputs = document.querySelectorAll('.player-input');
      if (playerInputs[0].value !== "") {
        player1Name = playerInputs[0].value;
      }
      if (playerInputs[1].value !== "") {
        player2Name = playerInputs[1].value;
      }
      for (let i of playerInputs) {
        i.remove();
      }
    }
    running = true;
    onStartScreen = false;
    initialize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    gameLoop();
  } else {
    window.addEventListener('keydown', startWithSpace, {once:true});
    return;
  }
}

// Start screen
function startScreen() {
  let fontSize = 30;
  const input1 = document.createElement('input');
  input1.setAttribute('id', 'player-1-input');
  input1.setAttribute('class', 'player-input');
  body.appendChild(input1);
  const input2 = document.createElement('input');
  input2.setAttribute('id', 'player-2-input');
  input2.setAttribute('class', 'player-input');
  body.appendChild(input2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'hsla(0, 0%, 80%, .8)';
  ctx.textAlign = 'center';
  ctx.font = `${fontSize}px serif`;
  ctx.fillText('Pong', canvas.width / 2, canvas.height / 2 - fontSize * 1.5);
  ctx.textAlign = 'right';
  ctx.fillText('Player 1:', canvas.width / 2, canvas.height / 2 - fontSize * .5);
  ctx.fillText('Player 2:', canvas.width / 2, canvas.height / 2 + fontSize * .5);
  ctx.textAlign = 'center';
  ctx.fillText('Press spacebar to start game', canvas.width / 2, canvas.height / 2 + fontSize * 1.5);

  window.addEventListener('keydown', startWithSpace, {once:true});
}

// Re-assign variables for new game state
function update() {
  leftPaddle.update(wPressed, sPressed);
  rightPaddle.update(upPressed, downPressed);
  ball1.update();
}

// Display winner after game ends
function displayWinner() {
  window.addEventListener('keydown', startWithSpace, {once:true});
  ctx.fillStyle = 'hsla(0, 0%, 80%, .8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(`${winner} wins!`, canvas.width / 2, canvas.height / 2);
  ctx.font = '16pt serif';
  ctx.fillText('(press spacebar for rematch)', canvas.width / 2, canvas.height / 2 + 30);
}

// End the game
function endGame() {
  running = false;
  if (leftScoreboard.score >= goalScore) {
    winner = player1Name;
  } else {
    winner = player2Name;
  }
  displayWinner();
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