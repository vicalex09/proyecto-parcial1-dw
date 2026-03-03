// === MAIN.JS - Archivo principal del juego ===
// Coordina la inicialización y ejecución del juego
// Requiere: player.js, fire.js, vidas.js

// === CONFIGURACIÓN DEL CANVAS ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const gameOverBackgroundCanvas = document.getElementById('gameOverBackground');
const gameOverBackgroundCtx = gameOverBackgroundCanvas.getContext('2d');
const retryButton = document.getElementById('retryButton');
const pauseOverlay = document.getElementById('pauseOverlay');
const pauseBackgroundCanvas = document.getElementById('pauseBackground');
const pauseBackgroundCtx = pauseBackgroundCanvas.getContext('2d');
const continueButton = document.getElementById('continueButton');

canvas.width = 128;
canvas.height = 192;

const PLAYER_SIZE = 8;
const PLAYER_SPEED = 2;
const CANVAS_COLOR = '#1a1a2e';
let isGameOver = false;
let isPause = false;

// === CARGAR SPRITESHEETS ===
const assetBasePath = window.location.pathname.includes('/Screens/') ? '../Assets/' : 'Assets/';

const shipsImage = new Image();
shipsImage.src = assetBasePath + 'SpaceShooterAssetPack_Ships.png';

const backgroundImage = new Image();
backgroundImage.src = assetBasePath + 'SpaceShooterAssetPack_BackGrounds.png';

const fireImage = new Image();
fireImage.src = assetBasePath + 'SpaceShooterAssetPack_Miscellaneous.png';

const shootImage = new Image();
shootImage.src = assetBasePath + 'SpaceShooterAssetPack_Projectiles.png';

// === SISTEMA DE PUNTUACIÓN ===
const scoreSystem = {
    value: 0,

    add(amount) {
        this.value += amount;
    },

    reset() {
        this.value = 0;
    },

    draw(ctx) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '6px "Press Start 2P", Arial';
        ctx.textAlign = 'left';
        ctx.fillText('SCORE: ' + this.value, 5, 12);
    }
};

// Exponer globalmente
window.score = scoreSystem;

// === FUNCIÓN PARA DIBUJAR SPRITES ===
function drawSprite(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, targetCtx = ctx) {
    if (image.complete && image.naturalWidth > 0) {
        targetCtx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}
function drawPauseBackground() {
    if (!pauseBackgroundCanvas) return;

    pauseBackgroundCanvas.width = canvas.width;
    pauseBackgroundCanvas.height = canvas.height;
    pauseBackgroundCtx.imageSmoothingEnabled = false;

    if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
        drawSprite(
            backgroundImage,
            0, 0,
            128, 192,
            0, 0,
            pauseBackgroundCanvas.width,
            pauseBackgroundCanvas.height,
            pauseBackgroundCtx
        );
    } else {
        pauseBackgroundCtx.fillStyle = CANVAS_COLOR;
        pauseBackgroundCtx.fillRect(0, 0, pauseBackgroundCanvas.width, pauseBackgroundCanvas.height);
    }
}

function drawGameOverBackground() {
    if (!gameOverBackgroundCanvas) return;

    gameOverBackgroundCanvas.width = canvas.width;
    gameOverBackgroundCanvas.height = canvas.height;
    gameOverBackgroundCtx.imageSmoothingEnabled = false;

    if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
        drawSprite(
            backgroundImage,
            0, 0,
            128, 192,
            0, 0,
            gameOverBackgroundCanvas.width,
            gameOverBackgroundCanvas.height,
            gameOverBackgroundCtx
        );
    } else {
        gameOverBackgroundCtx.fillStyle = CANVAS_COLOR;
        gameOverBackgroundCtx.fillRect(0, 0, gameOverBackgroundCanvas.width, gameOverBackgroundCanvas.height);
    }
}
function pause() {
    if (isPause || isGameOver) return;

    isPause = true
    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });

    drawPauseBackground();
    pauseOverlay.classList.add('is-visible');
    pauseOverlay.setAttribute('aria-hidden', 'false');
}

function resumeGame() {
    if (!isPause || isGameOver) return;

    isPause = false;
    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });

    pauseOverlay.classList.remove('is-visible');
    pauseOverlay.setAttribute('aria-hidden', 'true');
}

function showGameOver() {
    isGameOver = true;
    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });

    drawGameOverBackground();
    gameOverOverlay.classList.add('is-visible');
    gameOverOverlay.setAttribute('aria-hidden', 'false');
}

function restartGame() {
    if (typeof setupVidas === 'function') {
        setupVidas();
    }

    if (window.enemiesSystem && typeof window.enemiesSystem.reset === 'function') {
        window.enemiesSystem.reset();
    }

    if (window.score && typeof window.score.reset === 'function') {
        window.score.reset();
    }

    if (shoot && typeof shoot.reset === 'function') {
        shoot.reset();
    }

    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });

    fire.setType('idle');
    player.setSprite('idle');
    positionPlayer();

    isGameOver = false;
    isPause = false
    gameOverOverlay.classList.remove('is-visible');
    gameOverOverlay.setAttribute('aria-hidden', 'true');
    pauseOverlay.classList.remove('is-visible')
    pauseOverlay.setAttribute('aria-hidden', 'true');
}
window.pause = pause;
window.resumeGame = resumeGame;
window.showGameOver = showGameOver;

// === CREAR INSTANCIAS ===
const player = new Player({
    x: 0,
    y: 0,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    spriteX: shipSprites.idle.x,
    spriteY: shipSprites.idle.y,
    spriteWidth: 8,
    spriteHeight: 8,
});

const fire = new Fire(player);
const shoot = new Shoot(player);

// === POSICIONAR JUGADOR ===
function positionPlayer() {
    player.x = (canvas.width - player.width) / 2;
    player.y = canvas.height - player.height - 20;
}

// === CONTROL DE TECLADO ===
const keys = {};

// Registrar teclas presionadas
document.addEventListener('keydown', (event) => {
    if (isGameOver) return;

    if (event.key === 'Escape') {
        event.preventDefault();

        if (event.repeat) return;

        if (isPause) {
            resumeGame();
        } else {
            pause();
        }

        return;
    }

    if (isPause) return;

    keys[event.key] = true;
    
    // Disparar al presionar espacio
    if (event.key === ' ') {
        shoot.shoot();
    }
});

document.addEventListener('keyup', (event) => {
    if (isGameOver) return;

    if (isPause) {
        keys[event.key] = false;
        return;
    }

    keys[event.key] = false;
    // Cambiar sprite y fuego a idle si no hay teclas presionadas
    if (!keys['ArrowRight'] && !keys['ArrowLeft'] && !keys['ArrowUp'] && !keys['ArrowDown']) {
        player.setSprite('idle');
        fire.setType('idle');
    }
});

// Actualizar posición del jugador
function update(currentTime) {
    if (typeof currentTime === 'undefined') {
        currentTime = performance.now();
    }
    let dx = 0;
    let dy = 0;

    if (keys['ArrowRight']) {
        dx += PLAYER_SPEED/1.5;
        fire.setType('right');
    }
    if (keys['ArrowLeft']) {
        dx -= PLAYER_SPEED/1.5;
        fire.setType('left');
    }
    if (keys['ArrowUp']) {
        dy -= PLAYER_SPEED;
        fire.setType('thrust');
    }
    if (keys['ArrowDown']) {
        dy += PLAYER_SPEED/1.5;
        fire.setType('back');
    }

    player.move(dx, dy);
    shoot.update();

    // ---- enemigos ----
    if (window.enemiesSystem) {
        enemiesSystem.spawn(currentTime);
        enemiesSystem.update(currentTime);
    }
}

// === DIBUJAR EN CANVAS ===
function draw() {
    // Dibujar fondo - solo la primera sección (izquierda superior)
    if (backgroundImage.complete) {
        // Dibuja solo la primera sección del spritesheet del fondo
        drawSprite(
            backgroundImage,
            0, 0,              // Posición en el spritesheet (esquina superior izquierda)
            128, 192,          // Tamaño de la sección del fondo en el spritesheet
            0, 0,              // Posición en el canvas
            canvas.width, canvas.height    // Tamaño en el canvas
        );
    } else {
        // Si la imagen no carga, mostrar color de relleno
        ctx.fillStyle = CANVAS_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Dibujar jugador solo si la imagen está cargada
    if (shipsImage.complete && shipsImage.naturalWidth > 0) {
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
    } else {
        // Debug: Si la imagen no está cargada, dibujar un cuadrado de reemplazo
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Dibujar fuego debajo de la nave
    fire.draw(ctx, fireImage);
    
    // Dibujar proyectiles
    shoot.draw(ctx, shootImage);

    // Dibujar enemigos
    if (window.enemiesSystem) {
        enemiesSystem.draw(ctx, shipsImage);
    }

    // Dibujar puntuación
    if (window.score && typeof window.score.draw === 'function') {
        window.score.draw(ctx);
    }

    // Dibujar vidas
    if (window.drawVidas && typeof window.drawVidas === 'function') {
        window.drawVidas(ctx);
    }
}

// === LOOP DEL JUEGO ===
function gameLoop(timestamp) {
    if (!isGameOver && !isPause) {
        update(timestamp);
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// === INICIALIZACIÓN ===
retryButton.addEventListener('click', restartGame);
continueButton.addEventListener('click', resumeGame);
positionPlayer();
setupVidas();
gameLoop();
