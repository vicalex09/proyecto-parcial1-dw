const menuCanvas = document.getElementById('menuBackground');
const menuCtx = menuCanvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'Assets/SpaceShooterAssetPack_BackGrounds.png';

function resizeMenuCanvas() {
    menuCanvas.width = window.innerWidth;
    menuCanvas.height = window.innerHeight;
}


function drawSprite(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    if (image.complete && image.naturalWidth > 0) {
        menuCtx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}

function drawMenuBackground() {
    menuCtx.imageSmoothingEnabled = false;
    menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);

    const sourceWidth = 128;
    const sourceHeight = 192;
    const scale = Math.max(menuCanvas.width / sourceWidth, menuCanvas.height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const drawX = (menuCanvas.width - drawWidth) / 2;
    const drawY = (menuCanvas.height - drawHeight) / 2;

    drawSprite(
        backgroundImage,
        0, 0,
        sourceWidth, sourceHeight,
        drawX, drawY,
        drawWidth, drawHeight
    );
}

backgroundImage.onload = drawMenuBackground;
window.addEventListener('resize', () => {
    resizeMenuCanvas();
    drawMenuBackground();
});

resizeMenuCanvas();
drawMenuBackground();
