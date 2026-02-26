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

function resetGame() {
    vidasCount = 3;
    vidasDisplay.innerText = vidasCount;
    positionPlayer();
}
