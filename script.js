// === MAIN.JS - Archivo principal del juego ===
// Coordina la inicialización y ejecución del juego
// Requiere: player.js, fire.js, vidas.js

// === CONFIGURACIÓN DEL CANVAS ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 128;
canvas.height = 192;

const PLAYER_SIZE = 8;
const PLAYER_SPEED = 2;
const CANVAS_COLOR = '#1a1a2e';

// === CARGAR SPRITESHEETS ===

const shipsImage = new Image();
shipsImage.src = 'Assets/SpaceShooterAssetPack_Ships.png';

const backgroundImage = new Image();
backgroundImage.src = 'Assets/SpaceShooterAssetPack_BackGrounds.png';

const fireImage = new Image();
fireImage.src = 'Assets/SpaceShooterAssetPack_Miscellaneous.png';

const shootImage = new Image();
shootImage.src = 'Assets/SpaceShooterAssetPack_Projectiles.png';

// === FUNCIÓN PARA DIBUJAR SPRITES ===
function drawSprite(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    if (image.complete && image.naturalWidth > 0) {
        ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}

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
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
    // Cambiar sprite y fuego a idle si no hay teclas presionadas
    if (!keys['ArrowRight'] && !keys['ArrowLeft'] && !keys['ArrowUp'] && !keys['ArrowDown']) {
        player.setSprite('idle');
        fire.setType('idle');
    }
});

// Actualizar posición del jugador
function update(currentTime) {
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
    if (keys ['space']) {
        shoot.createProjectile();
    }

    player.move(dx, dy);
    shoot.update(currentTime);
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
}

// === LOOP DEL JUEGO ===
function gameLoop(timestamp) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}

// === INICIALIZACIÓN ===
positionPlayer();
setupVidas();
gameLoop();
