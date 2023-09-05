let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; // true가 되면 게임을 종료, 다시 false가 되면 시작
let score = 0;

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
  gameOverImage.src = "images/gameover.png";
}

let keysDown = {};
function setupKeyboardListner() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.key] = true;
    console.log("키다운 객체에 들어간 값?" + keysDown);
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.key];
    // console.log(keysDown);
    if (event.keyCode === 32) {
      createBullet();
    }
  });
}

/* 총알 함수
  1. 스페이스바 keyup 시 발사(생성)
  2. 발사 지점으로부터 y 좌표가 y=0 으로 이동
  3. 생성된 총알의 정보를 저장(좌표) => 배열
  4. 총알의 좌표값 계산. x => keyup 시점의 우주선 위치
  5. 배열을 render
*/

let bullets = [];
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.alive = true; // 적을 격추하면 false로
  this.init = function () {
    this.x = spaceshipX + 24;
    this.y = spaceshipY - 8;
    bullets.push(this);
    // console.log(bullets);
  };
  this.fire = function () {
    this.y -= 7;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemies.length; i++) {
      if (
        this.y <= enemies[i].y + 64 &&
        this.x >= enemies[i].x &&
        this.x < enemies[i].x + 64
      ) {
        // 총알 및 적군 소멸
        score++;
        this.alive = false;
        enemies.splice(i, 1);
      } else if (this.y <= 0) {
        this.alive = false;
      }
    }
  };
}

/* 격추 
  1. 총알.y <= 적군.y+64  &
  2. 총알.x >= 적군.x  &  총알.x < 적군.x + 64
  => 닿음, 총알 및 적군 소멸
*/

function createBullet() {
  console.log("총알 발사!!");
  let b = new Bullet();
  b.init();
}

/* 적군 생성
  1. 생성 위치 랜덤, 1초마다 생성  => x, y, init, attack
  2. y값+++
  3. 총알과 닿을 시 소멸 & 점수 +1
  4. y = canvas.height 도달 시 gameover
*/
let enemies = [];
const generateRandomValue = (min, max) => {
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = generateRandomValue(0, canvas.width - 66);
    this.y = 0;
    enemies.push(this);
    // console.log(bullets);
  };
  this.fire = function () {
    this.y += 3;
    if (this.y >= canvas.height - 64) {
      gameOver = true;
      console.log("gameOver");
    }
  };
}
function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if ("ArrowRight" in keysDown) {
    spaceshipX += 4;
  } else if ("ArrowLeft" in keysDown) {
    spaceshipX -= 4;
  }
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  } else if (spaceshipX >= canvas.width - 64) {
    spaceshipX = canvas.width - 64;
  }

  /* 총알의 y값 줄이기(발사) */
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].alive) {
      bullets[i].fire();
      bullets[i].checkHit();
    }
  }

  // 적군 y값
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].fire();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score: ${score}`, 20, 40);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].alive) {
      ctx.drawImage(bulletImage, bullets[i].x, bullets[i].y);
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y);
  }
}

function main() {
  if (!gameOver) {
    render();
    update();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 5, 100, 384, 256);
  }
}

loadImage();
setupKeyboardListner();
createEnemy();
main();
