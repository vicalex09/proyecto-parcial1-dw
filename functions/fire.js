// fire.js

const fireSprites = {
    idle: { x: 40, y: 16 },
    thrust: { x: 40, y: 24 },
    left: { x: 56, y: 16 },
    right: { x: 64, y: 16 },
    back: { x: 48, y: 16 },
};

function Fire(player) {
    this.player = player;
    this.type = 'idle';
}

Fire.prototype.setType = function(type) {
    if (fireSprites[type]) {
        this.type = type;
    } else {
        this.type = 'idle';
    }
};

Fire.prototype.draw = function(ctx, fireImage) {
    const sprite = fireSprites[this.type];
    drawSprite(
        fireImage,
        sprite.x,
        sprite.y,
        8, 8,
        this.player.x + this.player.width / 2 - 4,
        this.player.y + this.player.height,
        8, 8
    );
};
