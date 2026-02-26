// player.js

const shipSprites = {
    idle: { x: 8, y: 32 },
    right: { x: 16, y: 32 },
    left: { x: 0, y: 32 },
    up: { x: 8, y: 32 },
    down: { x: 8, y: 32 }
};

function Player(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.spriteX = config.spriteX;
    this.spriteY = config.spriteY;
    this.spriteWidth = config.spriteWidth;
    this.spriteHeight = config.spriteHeight;
}

Player.prototype.setSprite = function (dir) {
    const sprite = shipSprites[dir] || shipSprites.idle;
    this.spriteX = sprite.x;
    this.spriteY = sprite.y;
};

Player.prototype.move = function (dx, dy) {
    if (dx < 0) {
        this.setSprite("left");
    } else if (dx > 0) {
        this.setSprite("right");
    } else if (dy < 0) {
        this.setSprite("up");
    } else if (dy > 0) {
        this.setSprite("down");
    } else {
        this.setSprite("idle");
    }

    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x + dx));
    this.y = Math.max(0, Math.min(canvas.height - this.height, this.y + dy));
};
