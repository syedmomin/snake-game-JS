// Game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 20;
const tileCount = canvas.width / tileSize;
let snakeX = 10;
let snakeY = 10;
let snakeXSpeed = 0;
let snakeYSpeed = 0;
let snakeTrail = [];
let tailSize = 5;
let appleX = 15;
let appleY = 15;
let score = 0; // Initialize score

// Select the score display element
const scoreDisplay = document.getElementById("score");
let gameOver = false;
let gameStarted = false; // Track game start

// Handle keyboard input
document.addEventListener("keydown", keyDownEvent);

function keyDownEvent(event) {
  // Start the game when "Enter" is pressed
  if (!gameStarted && event.key === "Enter") {
    gameStarted = true;
    snakeXSpeed = 1; // Start moving right
    snakeYSpeed = 0;
    updateGame();
    return;
  }

  if (gameOver) return; // Ignore inputs if the game is over

  // Change snake direction based on arrow keys
  switch (event.keyCode) {
    case 37: // Left arrow key
      if (snakeXSpeed !== 1) {
        snakeXSpeed = -1;
        snakeYSpeed = 0;
      }
      break;
    case 38: // Up arrow key
      if (snakeYSpeed !== 1) {
        snakeXSpeed = 0;
        snakeYSpeed = -1;
      }
      break;
    case 39: // Right arrow key
      if (snakeXSpeed !== -1) {
        snakeXSpeed = 1;
        snakeYSpeed = 0;
      }
      break;
    case 40: // Down arrow key
      if (snakeYSpeed !== -1) {
        snakeXSpeed = 0;
        snakeYSpeed = 1;
      }
      break;
  }
}

// Display Game Over message
function showGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = "20px Arial";
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
  ctx.fillText("Press Enter to Continue", canvas.width / 2, canvas.height / 2 + 40);

  // Restart game on "Enter" key
  document.addEventListener("keydown", restartGame);
}

// Restart the game
function restartGame(event) {
  if (event.key === "Enter") {
    gameOver = false;
    gameStarted = false;
    snakeX = 10;
    snakeY = 10;
    snakeXSpeed = 0;
    snakeYSpeed = 0;
    snakeTrail = [];
    tailSize = 5;
    appleX = 15;
    appleY = 15;
    score = 0;
    scoreDisplay.textContent = score;
    document.removeEventListener("keydown", restartGame); // Remove restart listener
    drawStartScreen(); // Show the start screen
  }
}

// Draw the start screen
function drawStartScreen() {
  ctx.fillStyle = "#0d3002";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2);
}

// Update game logic
function updateGame() {
  if (gameOver) {
    showGameOver();
    return; // Stop the game loop
  }

  if (!gameStarted) {
    drawStartScreen();
    return; // Wait for game start
  }

  snakeX += snakeXSpeed;
  snakeY += snakeYSpeed;

  // Check if the snake collides with itself
  snakeTrail.forEach((segment) => {
    if (snakeX < 0 || snakeY < 0 || snakeX >= tileCount || snakeY >= tileCount) {
        gameOver = true; // End the game
        return;
      }
    if (segment.x === snakeX && segment.y === snakeY) {
      gameOver = true; // End the game
      return;
    }
  });

  // Add current position to the snake's trail
  snakeTrail.push({ x: snakeX, y: snakeY });
  while (snakeTrail.length > tailSize) {
    snakeTrail.shift(); // Remove old trail segments
  }

  // Check if the snake collides with the apple
  if (appleX === snakeX && appleY === snakeY) {
    tailSize++; // Increase tail size
    score++; // Increase score
    scoreDisplay.textContent = score; // Update score display
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
  }

  // Clear the canvas
  ctx.fillStyle = "#0d3002";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  ctx.fillStyle = "#00f";
  snakeTrail.forEach((segment) => {
    ctx.fillRect(
      segment.x * tileSize,
      segment.y * tileSize,
      tileSize,
      tileSize
    );
  });

  // Draw the apple
  ctx.fillStyle = "#f00";
  ctx.fillRect(
    appleX * tileSize,
    appleY * tileSize,
    tileSize,
    tileSize
  );

  // Call the update function again with a delay for slower speed
  setTimeout(() => requestAnimationFrame(updateGame), 30);
}

// Start the game with the initial screen
drawStartScreen();
