const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const PLAYER_SIZE = 50;
const PLAYER_SPEED = 5;
const CANVAS_COLOR = '#f0f0f0';
const PLAYER_COLOR = 'blue';

const player = {
    x: 50,
    y: 50,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE
};

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
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += PLAYER_SPEED;
    }
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= PLAYER_SPEED;
    }
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= PLAYER_SPEED;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += PLAYER_SPEED;
    }
}

// Dibujar en canvas
function draw() {
    // Limpiar canvas
    ctx.fillStyle = CANVAS_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar jugador
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Loop del juego
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Iniciar juego
gameLoop();
