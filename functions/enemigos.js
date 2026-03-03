// enemigos.js - Sistema de enemigos

// Coordenadas de sprites en el spritesheet de naves
// Ajustadas para alinearse correctamente con SpaceShooterAssetPack_Ships.png
const enemySprites = {
    // Enemigo básico (pequeño)
    basic: { x: 64, y: 0, width: 8, height: 8 },
    // Enemigo especial (más grande)
    special: { x: 32, y: 64, width: 16, height: 16 }
};

function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 8;    // ancho visual - enemigo básico
    this.height = 8;   // alto visual - enemigo básico
    this.speed = 1 + Math.random() * 1; // velocidad variable
    this.hp = 1;               // puntos de vida
    this.isSpecial = false;    // marca de enemigo especial
    this.lastShot = 0;         // usado solo por enemigos especiales
    this.shotInterval = 2000;  // tiempo entre disparos especiales
    this.direction = 1;        // 1=derecha, -1=izquierda
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
    
    // Seleccionar sprite según si es especial o no
    const spriteData = this.isSpecial ? enemySprites.special : enemySprites.basic;
    
    // Dibujar el sprite del enemigo
    drawSprite(
        shipsImage,
        spriteData.x,
        spriteData.y,
        spriteData.width,
        spriteData.height,
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
        // decidir si generamos un enemigo especial (10% de probabilidad)
        if (Math.random() < 0.1) {
            const x = Math.random() * (canvas.width - 16);
            const special = new Enemy(x, 0); // colocar fija en la parte superior
            special.isSpecial = true;
            special.width = 16;
            special.height = 16;
            special.hp = 5;
            special.speed = 0.5 + Math.random() * 0.5;
            // la dirección inicial puede ser aleatoria
            special.direction = Math.random() < 0.5 ? 1 : -1;
            this.list.push(special);
        } else {
            const x = Math.random() * (canvas.width - 8);
            this.list.push(new Enemy(x, -8));
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

