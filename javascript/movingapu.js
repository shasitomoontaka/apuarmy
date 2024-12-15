const smallImages = document.querySelectorAll('.small-image');

smallImages.forEach((smallImage) => {
    function randomSpeed() {
        return Math.random() * 1 + 0.5; // Adjust the values for speed limits
    }

    function randomDirection() {
        return Math.random() * 360;
    }

    function randomRotation() {
        return Math.random() * 360;
    }

    function moveImage() {
        const imageWidth = smallImage.offsetWidth;
        const imageHeight = smallImage.offsetHeight;
        let speed = randomSpeed();
        let angle = randomDirection();
        let rotation = randomRotation();
        let posX = document.documentElement.clientWidth * Math.random();
        let posY = document.documentElement.clientHeight * Math.random();

        function updatePos() {
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;

            posX += dx;
            posY += dy;

            if (posX < 0 || posX + imageWidth > document.documentElement.clientWidth) {
                angle = 180 + Math.random() * 180;
                posX = posX < 0 ? 0 : document.documentElement.clientWidth - imageWidth;
                speed = randomSpeed();
            }

            if (posY < 0 || posY + imageHeight > document.documentElement.clientHeight) {
                angle = Math.random() * 180;
                posY = posY < 0 ? 0 : document.documentElement.clientHeight - imageHeight;
                speed = randomSpeed();
            }

            rotation += 1; // Increase rotation angle by 1 degree

            smallImage.style.left = posX + 'px';
            smallImage.style.top = posY + 'px';
            smallImage.style.transform = `rotate(${rotation}deg)`;

            if (Math.random() < 0.001) {
                angle = randomDirection();
            }
        }

        const interval = setInterval(updatePos, 10 / 600);

        smallImage.addEventListener('click', () => {
            clearInterval(interval);
            moveImage();
        });
    }

    moveImage();
});