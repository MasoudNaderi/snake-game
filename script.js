// DOM Elements
const playBoard = document.querySelector(".play-board");
const scoreEl = document.querySelector(".score");
const highScoreEl = document.querySelector(".high-score");

// variables
let gameOver = false;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let snakeSpeed = 150;
let score = 0;
let interval;
let highScore = sessionStorage.getItem("high-score") || 0;

scoreEl.innerText = `Score: 0`;
highScoreEl.innerText = `High Score: ${highScore}`;

const foodTypes = [
  {
    color: "#03A6A1",
    points: 1,
    effect: "normal",
  },
  {
    color: "#03A6A1",
    points: 1,
    effect: "normal",
  },
  {
    color: "#03A6A1",
    points: 1,
    effect: "normal",
  },
  {
    color: "#F7374F",
    points: 2,
    effect: "speed",
  },
  {
    color: "#A0C878",
    points: 3,
    effect: "slow",
  },
  {
    color: "#725CAD",
    points: 4,
    effect: "shrink",
  },
  {
    color: "#EB8500",
    points: 2,
    effect: "bonus",
  },
];

const generateFood = () => {
  let foodX, foodY;
  let selectedFood;

  do {
    // generate random food type and position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    selectedFood = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  } while (
    // Avoid food spawning on snake
    snakeBody.some((segment) => segment[0] === foodX && segment[1] === foodY)
  );

  return { foodX, foodY, ...selectedFood };
};
let currentFood = generateFood();

const handleGameOver = () => {
  // remove init interval and reload
  clearInterval(interval);
  alert("game over ! press ok to play again.");
  location.reload();
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
  initGame();
};

const showMessage = () => {
  const messageEl = document.createElement("div");
  messageEl.className = "message";
  messageEl.innerHTML = `<span style="color:${currentFood.color}">+${currentFood.points} points</span><br>${currentFood.effect} effect applied`;
  document.body.appendChild(messageEl);
  messageEl.classList.add("fade-in");
  setTimeout(() => messageEl.remove(), 2500);
};

const initGame = () => {
  if (gameOver) return handleGameOver();
  let { foodX, foodY, points, effect, color } = currentFood;
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX};background-color:${color};"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    //if snake eats food
    snakeBody.push([foodX, foodY]);
    score += points;
    snakeSpeed = Math.max(50, snakeSpeed - 5);

    switch (effect) {
      case "speed":
        snakeSpeed *= 0.9;
        break;
      case "slow":
        snakeSpeed *= 1.3;
      case "shrink":
        snakeBody.pop();
      case "bonus":
        break;
      case "normal":
      default:
        break;
    }
    showMessage();
    currentFood = generateFood();

    clearInterval(interval);
    interval = setInterval(initGame, snakeSpeed);

    highScore = score >= highScore ? score : highScore;
    sessionStorage.setItem("high-score", highScore);
    scoreEl.innerText = `Score: ${score}`;
    highScoreEl.innerText = `High Score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    //shift each value forward
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  snakeX += velocityX;
  snakeY += velocityY;

  snakeX = snakeX < 1 ? 30 : snakeX > 30 ? 1 : snakeX;
  snakeY = snakeY < 1 ? 30 : snakeY > 30 ? 1 : snakeY;

  for (let i = 0; i < snakeBody.length; i++) {
    if (i === 0) {
      htmlMarkup += `<div class="snake head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"><span></span><span></span></div>`;
    } else {
      htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

interval = setInterval(initGame, snakeSpeed);
document.addEventListener("keydown", changeDirection);
