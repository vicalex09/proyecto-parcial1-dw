// enemigos.js - Sistema de enemigos

// Cada enemigo se representa como un rectángulo que baja desde la parte superior.
const enemySprites = {
    // coordenadas dentro del spritesheet de naves (puede ajustarse según el assetpack)
    basic: { x: 0, y: 0 },
};

function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;   // nuevo ancho
    this.height = 16;  // nueva altura
    this.speed = 1 + Math.random() * 1; // velocidad variable entre 1 y 3
    this.hp = 1;               // puntos de vida, puede aumentarse para especiales
    this.isSpecial = false;    // marca de enemigo especial
    this.lastShot = 0;         // usado solo por enemigos especiales
    this.shotInterval = 2000;  // tiempo entre disparos especiales
    this.direction = 1;        // 1=derecha, -1=izquierda; usado para especiales
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
    // borde amarillo para el enemigo especial
    if (this.isSpecial) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
};

// Sistema global de enemigos
const enemiesSystem = {
    list: [],
    spawnInterval: 1000, // ms entre apariciones
    lastSpawn: 0,

    spawn: function (currentTime) {
        if (currentTime - this.lastSpawn < this.spawnInterval) return;
        this.lastSpawn = currentTime;
        // decidir si generamos un enemigo especial (10% de probabilidad)
        if (Math.random() < 0.1) {
            const x = Math.random() * (canvas.width - 32);
            const special = new Enemy(x, 0); // colocar fija en la parte superior
            special.isSpecial = true;
            special.width = 32;let invaders = [];
let invDir = 1; // 1=right, -1=left
let invSpeed = 1.2;
let invDropY = 0;
let invMoveTimer = 0;
const INV_MOVE_INTERVAL = 28; // frames between moves
let invMoveStep = 8;
let invaderShootTimer = 0;

const INV_SHAPES = [
  // type 0 — squid
  (x, y, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x-12, y-6, 24, 12);
    ctx.fillRect(x-8, y-12, 16, 8);
    ctx.fillRect(x-16, y+2, 6, 6);
    ctx.fillRect(x+10, y+2, 6, 6);
    ctx.clearRect(x-6, y-4, 4, 4);
    ctx.clearRect(x+2, y-4, 4, 4);
  },
  // type 1 — crab
  (x, y, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x-14, y-4, 28, 10);
    ctx.fillRect(x-10, y-10, 20, 8);
    ctx.fillRect(x-18, y-2, 6, 4);
    ctx.fillRect(x+12, y-2, 6, 4);
    ctx.fillRect(x-18, y+6, 4, 6);
    ctx.fillRect(x+14, y+6, 4, 6);
    ctx.clearRect(x-8, y-6, 4, 4);
    ctx.clearRect(x+4, y-6, 4, 4);
  },
  // type 2 — octopus
  (x, y, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x-10, y-12, 20, 20);
    ctx.fillRect(x-14, y-6, 28, 12);
    ctx.fillRect(x-16, y+6, 4, 6);
    ctx.fillRect(x-8, y+6, 4, 6);
    ctx.fillRect(x+4, y+6, 4, 6);
    ctx.fillRect(x+12, y+6, 4, 6);
    ctx.clearRect(x-6, y-8, 4, 4);
    ctx.clearRect(x+2, y-8, 4, 4);
  },
];

const INV_COLORS = ['#ff2244', '#ff8800', '#ffe000', '#39ff14', '#00f5ff'];

function buildInvaders() {
  invaders = [];
  const cols = 11, rows = 5;
  const startX = 60, startY = 60 + (level - 1) * 8;
  const spacingX = 52, spacingY = 46;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = r < 1 ? 2 : r < 3 ? 1 : 0;
      const color = INV_COLORS[r % INV_COLORS.length];
      invaders.push({
        x: startX + c * spacingX,
        y: startY + r * spacingY,
        type,
        color,
        alive: true,
        w: 30, h: 24,
        frame: 0,
      });
    }
  }

  invDir = 1;
  invSpeed = 1.0 + (level - 1) * 0.3;
  invMoveTimer = 0;
  eBullets = [];
}

// ── UFO
let ufo = null;
let ufoTimer = 0;
const UFO_INTERVAL = 600;

function spawnUfo() {
  ufo = { x: -30, y: 36, speed: 2.5, alive: true };
}
            special.height = 32;
            special.hp = 3;
            special.speed = 0.5 + Math.random() * 0.5;
            // la dirección inicial puede ser aleatoria
            special.direction = Math.random() < 0.5 ? 1 : -1;
            this.list.push(special);
        } else {
            const x = Math.random() * (canvas.width - 16);
            this.list.push(new Enemy(x, -16));
        }
    },

    update: function (currentTime) {
        // actualizar enemigos y generar tiros de especiales
        for (let i = this.list.length - 1; i >= 0; i--) {
            const enemy = this.list[i];
            // movimiento especial: en el borde superior sólo va de izquierda a derecha
            if (enemy.isSpecial) {
                // mover horizontalmente
                enemy.x += enemy.speed * enemy.direction;
                // rebotar en bordes y cambiar dirección
                if (enemy.x <= 0) {
                    enemy.x = 0;
                    enemy.direction = 1;
                } else if (enemy.x + enemy.width >= canvas.width) {
                    enemy.x = canvas.width - enemy.width;
                    enemy.direction = -1;
                }
            } else {
                enemy.update();
            }

            // los especiales disparan cada cierto intervalo
            if (enemy.active && enemy.isSpecial) {
                if (currentTime - enemy.lastShot > enemy.shotInterval) {
                    enemy.lastShot = currentTime;
                    // crear proyectil hacia abajo
                    const shot = {
                        x: enemy.x + enemy.width / 2 - 2,
                        y: enemy.y + enemy.height,
                        width: 4,
                        height: 8,
                        speed: 2,
                        active: true
                    };
                    this.enemyProjectiles.push(shot);
                }
            }

            // colisión con jugador (cuerpo)
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

        // actualizar proyectiles enemigos
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const proj = this.enemyProjectiles[i];
            proj.y += proj.speed;
            // colisión con jugador
            if (proj.active &&
                proj.x < player.x + player.width &&
                proj.x + proj.width > player.x &&
                proj.y < player.y + player.height &&
                proj.y + proj.height > player.y) {
                proj.active = false;
                if (typeof hitPlayer === 'function') {
                    hitPlayer();
                }
            }
            if (proj.y > canvas.height || !proj.active) {
                this.enemyProjectiles.splice(i, 1);
            }
        }
    },

    draw: function (ctx, shipsImage) {
        for (const enemy of this.list) {
            enemy.draw(ctx, shipsImage);
        }
        // dibujar tiros enemigos
        ctx.fillStyle = '#ff0000';
        for (const proj of this.enemyProjectiles) {
            ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
        }
    },
    // lista de proyectiles disparados por enemigos especiales
    enemyProjectiles: [],

    // Reiniciar los enemigos y sus proyectiles
    reset: function() {
        this.list = [];
        this.enemyProjectiles = [];
        this.lastSpawn = 0;
    }
};

// Exponer para que script.js pueda invocarlo si no se hace con import/module
window.enemiesSystem = enemiesSystem;

