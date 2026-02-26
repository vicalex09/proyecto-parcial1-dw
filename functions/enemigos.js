// enemigos.js - Sistema de enemigos

// Cada enemigo se representa como un rectángulo que baja desde la parte superior.
const enemySprites = {
    // coordenadas dentro del spritesheet de naves (puede ajustarse según el assetpack)
    basic: { x: 0, y: 0 },
};

function Enemy(x, y) {
    this.x = x;
    this.y = y;
    // ampliamos el tamaño de la nave y su hitbox
    this.width = 16;   // nuevo ancho
    this.height = 16;  // nueva altura
    this.speed = 1 + Math.random() * 1; // velocidad variable entre 1 y 3
    this.active = true;
}

Enemy.prototype.update = function () {
    this.y += this.speed;
    // fuera de pantalla -> inactivo
    if (this.y > canvas.height) {
        this.active = false;
    }
};

Enemy.prototype.draw = function (ctx, shipsImage) {
    if (!this.active) return;
    const sprite = enemySprites.basic;
    // origen fijo de 8x8 en el spritesheet, destino escalado al tamaño actual
    const srcSize = 8;
    drawSprite(
        shipsImage,
        sprite.x,
        sprite.y,
        srcSize,
        srcSize,
        this.x,
        this.y,
        this.width,
        this.height
    );
};

// Sistema global de enemigos
const enemiesSystem = {
    list: [],
    spawnInterval: 1000, // ms entre apariciones
    lastSpawn: 0,

    spawn: function (currentTime) {
        if (currentTime - this.lastSpawn < this.spawnInterval) return;
        this.lastSpawn = currentTime;
        // calcular posición usando nuevo tamaño del enemigo
        const x = Math.random() * (canvas.width - 16);
        this.list.push(new Enemy(x, -16));
    },

    update: function () {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const enemy = this.list[i];
            enemy.update();
            // colisión con jugador
            if (enemy.active &&
                enemy.x < player.x + player.width &&
                enemy.x + enemy.width > player.x &&
                enemy.y < player.y + player.height &&
                enemy.y + enemy.height > player.y) {
                // tocó al jugador
                enemy.active = false;
                if (typeof hitPlayer === 'function') {
                    hitPlayer();
                }
            }
            if (!enemy.active) {
                this.list.splice(i, 1);
            }
        }
    },

    draw: function (ctx, shipsImage) {
        for (const enemy of this.list) {
            enemy.draw(ctx, shipsImage);
        }
    }
};

// Exponer para que script.js pueda invocarlo si no se hace con import/module
window.enemiesSystem = enemiesSystem;

