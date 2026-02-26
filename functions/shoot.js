// shoot.js - Sistema de disparo automático

const shootSprites = {
    shoot: { x: 32, y: 16 },
};

// Constructor para un proyectil individual
function Projectile(x, y) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 8;
    this.speed = 2;
    this.active = true;
}

// Actualizar posición del proyectil
Projectile.prototype.update = function() {
    this.y -= this.speed;
    
    // Desactivar si sale de la pantalla
    if (this.y < -this.height) {
        this.active = false;
    }
};

// Dibujar el proyectil
Projectile.prototype.draw = function(ctx, shootImage) {
    if (this.active) {
        drawSprite(
            shootImage,
            shootSprites.shoot.x,
            shootSprites.shoot.y,
            8, 8,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
};

// Sistema de disparo que maneja todos los proyectiles
function Shoot(player) {
    this.player = player;
    this.projectiles = [];
    this.canShoot = true;
    this.shootCooldown = 200; // 200ms entre disparos
}

// Disparar (llamado cuando se presiona espacio)
Shoot.prototype.shoot = function() {
    if (this.canShoot) {
        const x = this.player.x + this.player.width / 2 - 4; // Centrar el proyectil en el jugador
        const y = this.player.y;
        this.projectiles.push(new Projectile(x, y));
        
        // Activar cooldown
        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, this.shootCooldown);
    }
};

// Actualizar todos los proyectiles
Shoot.prototype.update = function() {
    // Actualizar posición de cada proyectil
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
        this.projectiles[i].update();
        
        // Eliminar proyectiles inactivos
        if (!this.projectiles[i].active) {
            this.projectiles.splice(i, 1);
        }
    }
};


// Dibujar todos los proyectiles activos
Shoot.prototype.draw = function(ctx, shootImage) {
    for (let i = 0; i < this.projectiles.length; i++) {
        this.projectiles[i].draw(ctx, shootImage);
    }
};
