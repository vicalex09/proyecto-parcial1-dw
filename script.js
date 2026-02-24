// === VARIABLES GLOBALES ===
let vidasCount = 3; // Contador de vidas
const vidasDisplay = document.getElementById("vidas");
const botonDaño = document.getElementById("botonDaño");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 512;
canvas.height = 1024;

const PLAYER_SIZE = 64;
const PLAYER_SPEED = 5;
const CANVAS_COLOR = '#1a1a2e';

// Cargar spritesheets
const shipsImage = new Image();
shipsImage.src = 'Assets/SpaceShooterAssetPack_Ships.png';

const backgroundImage = new Image();
backgroundImage.src = 'Assets/SpaceShooterAssetPack_BackGrounds.png';

// Función para extraer sprites del spritesheet
function drawSprite(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    if (image.complete && image.naturalWidth > 0) {
        ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}

const SPRITES = {
    idle: { x: 8, y: 0 },
    right: { x: 16, y: 0 },
    left: { x: 0, y: 0 },
    up: { x: 8, y: 0 },
    down: { x: 8, y: 0 }
};

function Player(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.spriteX = config.spriteX;
    this.spriteY = config.spriteY;
    this.spriteWidth = config.spriteWidth;
    this.spriteHeight = config.spriteHeight;
}

Player.prototype.setSprite = function (dir) {
    const sprite = SPRITES[dir] || SPRITES.idle;
    this.spriteX = sprite.x;
    this.spriteY = sprite.y;
};

Player.prototype.move = function (dx, dy) {
    if (dx < 0) {
        this.setSprite("left");
    } else if (dx > 0) {
        this.setSprite("right");
    } else if (dy < 0) {
        this.setSprite("up");
    } else if (dy > 0) {
        this.setSprite("down");
    } else {
        this.setSprite("idle");
    }

    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x + dx));
    this.y = Math.max(0, Math.min(canvas.height - this.height, this.y + dy));
};

const player = new Player({
    x: 0,
    y: 0,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    spriteX: SPRITES.idle.x,
    spriteY: SPRITES.idle.y,
    spriteWidth: 8,
    spriteHeight: 8
});

function positionPlayer() {
    player.x = (canvas.width - player.width) / 2;
    player.y = canvas.height - player.height - 20;
}

const keys = {};

// Registrar teclas presionadas (una sola vez)
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Actualizar posición del jugador
function update() {
    let dx = 0;
    let dy = 0;

    if (keys['ArrowRight']) {
        dx += PLAYER_SPEED/1.5;
    }
    if (keys['ArrowLeft']) {
        dx -= PLAYER_SPEED/1.5;
    }
    if (keys['ArrowUp']) {
        dy -= PLAYER_SPEED;
    }
    if (keys['ArrowDown']) {
        dy += PLAYER_SPEED;
    }

    player.move(dx, dy);
}
// === SISTEMA DE VIDAS ===
function setupVidas() {
    vidasDisplay.innerText = vidasCount;

    if (!botonDaño) {
        return;
    }

    botonDaño.addEventListener("click", () => {
        if (vidasCount > 0) {
            vidasCount--;
            vidasDisplay.innerText = vidasCount;

            if (vidasCount === 0) {
                alert("Game Over - Has perdido todas tus vidas");
                resetGame();
            }
        }
    });
}

function resetGame() {
    vidasCount = 3;
    vidasDisplay.innerText = vidasCount;
    positionPlayer();
}   

// Dibujar en canvas
function draw() {
    // Dibujar fondo - solo la primera sección (izquierda superior)
    if (backgroundImage.complete) {
        // Dibuja solo la primera sección del spritesheet del fondo
        drawSprite(
            backgroundImage,
            0, 0,              // Posición en el spritesheet (esquina superior izquierda)
            128, 256,          // Tamaño de la sección del fondo en el spritesheet
            0, 0,              // Posición en el canvas
            canvas.width, canvas.height    // Tamaño en el canvas
        );
    } else {
        // Si la imagen no carga, mostrar color de relleno
        ctx.fillStyle = CANVAS_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Dibujar jugador con sprite
    drawSprite(
        shipsImage,
        player.spriteX,
        player.spriteY,
        player.spriteWidth,
        player.spriteHeight,
        player.x,
        player.y,
        player.width,
        player.height
    );
}

// === LOOP DEL JUEGO ===
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// === INICIALIZACIÓN ===
positionPlayer();
setupVidas();
gameLoop();
