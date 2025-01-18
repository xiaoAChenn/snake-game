const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let direction = {x: 0, y: 0};
let score = 0;

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 100);
}

function update() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  
  // 边界检测
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    resetGame();
    return;
  }
  
  // 自身碰撞检测
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    resetGame();
    return;
  }
  
  snake.unshift(head);
  
  // 食物检测
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  // 清空画布
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 绘制蛇
  snake.forEach((segment, index) => {
    const gradient = ctx.createRadialGradient(
      segment.x * gridSize + gridSize/2,
      segment.y * gridSize + gridSize/2,
      0,
      segment.x * gridSize + gridSize/2,
      segment.y * gridSize + gridSize/2,
      gridSize/2
    );
    
    // 头部颜色更亮
    if (index === 0) {
      gradient.addColorStop(0, '#4CAF50');
      gradient.addColorStop(1, '#2E7D32');
    } else {
      gradient.addColorStop(0, '#388E3C');
      gradient.addColorStop(1, '#1B5E20');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2,
      5
    );
    ctx.fill();
  });
  
  // 绘制食物
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  
  // 确保食物不会生成在蛇身上
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  }
}

function resetGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 0, y: 0};
  score = 0;
  scoreElement.textContent = score;
  placeFood();
}

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = {x: 1, y: 0};
      break;
  }
});

placeFood();
gameLoop();
