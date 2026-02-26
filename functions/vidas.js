// vidas.js

let vidasCount = 3;
const vidasDisplay = document.getElementById("vidas");
const botonDaño = document.getElementById("botonDaño");

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

// Reduce una vida cuando el jugador es golpeado por un enemigo.
// Esta función puede ser invocada desde otros módulos (p.ej. sistema de enemigos).
function hitPlayer() {
    if (vidasCount > 0) {
        vidasCount--;
        vidasDisplay.innerText = vidasCount;
        if (vidasCount === 0) {
            alert("Game Over - Has perdido todas tus vidas");
            resetGame();
        }
    }
}

// Exportar la función globalmente por simplicidad
window.hitPlayer = hitPlayer;

function resetGame() {
    vidasCount = 3;
    vidasDisplay.innerText = vidasCount;
    positionPlayer();
}
