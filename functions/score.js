// score.js - Manejo de la puntuación del jugador

const scoreSystem = {
    value: 0,

    add(amount) {
        this.value += amount;
    },

    reset() {
        this.value = 0;
    },

    draw(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('Score: ' + this.value, 5, 12);
    }
};

// exportar globalmente para que otros módulos puedan usarlo
window.score = scoreSystem;
