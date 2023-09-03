let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

/* 우주선 좌표 */
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background2.jpg";
  spaceshipImage = new Image();
  spaceshipImage.src = "images/me.png";
  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";
  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";
  gameOverImage = new Image();
  gameOverImage.src = "images/gameoverLogo.png";
}

let keysDown = {};
function setupKeyboardListner() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.key] = true;
    console.log("키다운 객체에 들어간 값?" + keysDown);
  });
  document.addEventListener("keyup", function () {
    delete keysDown[event.key];
    console.log(keysDown);
  });
}

function update() {
  if ("ArrowRight" in keysDown) {
    spaceshipX += 3;
  } else if ("ArrowLeft" in keysDown) {
    spaceshipX -= 3;
  }
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  } else if (spaceshipX >= canvas.width - 64) {
    spaceshipX = canvas.width - 64;
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
}

function main() {
  render();
  update();
  requestAnimationFrame(main);
}

loadImage();
setupKeyboardListner();
main();
