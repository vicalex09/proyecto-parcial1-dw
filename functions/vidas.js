// vidas.js

let vidasCount = 3;

function setupVidas() {
    // Inicializar vidas al valor por defecto
    vidasCount = 3;
}

// Reduce una vida cuando el jugador es golpeado por un enemigo.
// Esta función puede ser invocada desde otros módulos (p.ej. sistema de enemigos).
function hitPlayer() {
    if (vidasCount > 0) {
        vidasCount--;
        if (vidasCount === 0) {
            if (window.showGameOver && typeof window.showGameOver === 'function') {
                window.showGameOver();
            }
        }
    }
}

// Dibuja las vidas en el canvas
function drawVidas(ctx) {
    ctx.fillStyle = '#ff0000';
    ctx.font = '6px "Press Start 2P", Arial';
    ctx.textAlign = 'left';
    ctx.fillText('VIDAS: ' + vidasCount, 5, 22);
}

// Exportar funciones globalmente
window.hitPlayer = hitPlayer;
window.drawVidas = drawVidas;
