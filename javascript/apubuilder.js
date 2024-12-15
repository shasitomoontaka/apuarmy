const container = document.getElementById('ab-container');
const hideElementsBtn = document.getElementById('ab-hideElementsBtn');
const thumbnails = document.querySelectorAll('.ab-thumbnail img');
let isHidden = false;

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', (event) => {
        const img = document.createElement('img');
        img.src = event.target.src;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'ab-image-container';
        imgContainer.style.left = '10px';
        imgContainer.style.top = '10px';
        imgContainer.style.width = '100px';
        imgContainer.style.height = '100px';

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'ab-resize-handle ab-br';

        const mirrorBtn = document.createElement('button');
        mirrorBtn.innerText = '\u2194';
        let isFlipped = false;
        mirrorBtn.addEventListener('click', () => {
            isFlipped = !isFlipped;
            updateTransform();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'X';
        deleteBtn.addEventListener('click', () => {
            container.removeChild(imgContainer);
        });

        const rotateBtn = document.createElement('button');
        rotateBtn.innerText = '\u21BA';
        let startX, startY, initialAngle = 0;

        rotateBtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startX = e.clientX;
            startY = e.clientY;
            initialAngle = getRotationAngle(img);
            document.addEventListener('mousemove', rotateImage);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', rotateImage);
            }, { once: true });
        });

        function rotateImage(e) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const angle = initialAngle + Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            img.style.transform = `rotate(${angle}deg) scaleX(${isFlipped ? -1 : 1})`;
        }

        function getRotationAngle(target) {
            const style = window.getComputedStyle(target, null);
            const transform = style.getPropertyValue('transform');
            if (transform === 'none') return 0;
            const values = transform.split('(')[1].split(')')[0].split(',');
            const a = values[0];
            const b = values[1];
            const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            return angle;
        }

        function updateTransform() {
            const currentAngle = getRotationAngle(img);
            img.style.transform = `rotate(${currentAngle}deg) scaleX(${isFlipped ? -1 : 1})`;
        }

        imgContainer.appendChild(img);
        imgContainer.appendChild(resizeHandle);
        container.appendChild(imgContainer);

        const mirrorActionButtons = document.createElement('div');
        mirrorActionButtons.className = 'ab-action-buttons ab-top-left';
        mirrorActionButtons.appendChild(mirrorBtn);
        mirrorBtn.style.color = '#ADD8E6'; // Light blue
        mirrorBtn.style.backgroundColor = 'rgba(173, 216, 230, 0)';
        mirrorBtn.style.fontFamily = 'inherit';

        const deleteActionButtons = document.createElement('div');
        deleteActionButtons.className = 'ab-action-buttons ab-top-right';
        deleteActionButtons.appendChild(deleteBtn);
        deleteBtn.style.color = '#FF0000'; // Red
        deleteBtn.style.backgroundColor = 'rgba(255, 0, 0, 0)';
        deleteBtn.style.fontFamily = 'inherit';

        const rotateActionButtons = document.createElement('div');
        rotateActionButtons.className = 'ab-action-buttons ab-bottom-left';
        rotateActionButtons.appendChild(rotateBtn);
        rotateBtn.style.color = '#00008B'; // Dark blue
        rotateBtn.style.backgroundColor = 'rgba(0, 0, 139, 0)';
        rotateBtn.style.fontFamily = 'inherit';

        imgContainer.appendChild(mirrorActionButtons);
        imgContainer.appendChild(deleteActionButtons);
        imgContainer.appendChild(rotateActionButtons);

        let isDragging = false;
        let isResizing = false;
        let dragStartX, dragStartY, initialLeft, initialTop;
        let resizeStartX, resizeStartY, initialWidth, initialHeight;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            initialWidth = imgContainer.offsetWidth;
            initialHeight = imgContainer.offsetHeight;
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event propagation
        });

        imgContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            initialLeft = imgContainer.offsetLeft;
            initialTop = imgContainer.offsetTop;
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event propagation
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                imgContainer.style.left = `${initialLeft + deltaX}px`;
                imgContainer.style.top = `${initialTop + deltaY}px`;
            } else if (isResizing) {
                const deltaX = e.clientX - resizeStartX;
                const deltaY = e.clientY - resizeStartY;
                imgContainer.style.width = `${initialWidth + deltaX}px`;
                imgContainer.style.height = `${initialHeight + deltaY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
        });

    });
});

hideElementsBtn.addEventListener('click', () => {
    const buttons = document.querySelectorAll('.ab-action-buttons, .ab-resize-handle');
    isHidden = !isHidden;
    buttons.forEach(button => {
        button.style.display = isHidden ? 'none' : 'block';
    });
    hideElementsBtn.innerText = isHidden ? 'Show Elements' : 'Hide Elements';
});



   // Function to draw the content of the ab-container onto a canvas
document.getElementById('ab-download-btn').addEventListener('click', async function() {
    // Show loading state
    const originalButtonText = this.textContent;
    this.textContent = 'Generating image...';
    this.disabled = true;

    try {
        // Get the container
        const container = document.getElementById('ab-container');

        // Wait a brief moment for any ongoing transitions/transforms
        await new Promise(resolve => setTimeout(resolve, 100));

        // Generate the image
        const dataUrl = await domtoimage.toPng(container, {
            quality: 1.0,
            bgcolor: 'white',
            style: {
                'transform': 'none',
                'transform-origin': 'center'
            },
            filter: (node) => {
                // Include only the container and its contents
                return (node.id === 'ab-container' || 
                        node.parentNode.id === 'ab-container' ||
                        node.tagName === 'IMG');
            }
        });

        // Create download link
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        link.download = `apu-creation-${timestamp}.png`;
        link.href = dataUrl;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error generating image:', error);
        alert('Error generating image. Please try again.');
    } finally {
        // Reset button state
        this.textContent = originalButtonText;
        this.disabled = false;
    }
});

// Function to prepare images when they're added to the container
function prepareImagesForCapture() {
    const container = document.getElementById('ab-container');
    
    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'IMG') {
                        // Set crossOrigin attribute for images
                        node.crossOrigin = 'anonymous';
                        
                        // If the image is already loaded, reload it with crossOrigin
                        if (node.complete && node.src) {
                            const src = node.src;
                            node.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                            setTimeout(() => {
                                node.src = src;
                            }, 0);
                        }
                    }
                });
            }
        });
    });

    // Start observing the container
    observer.observe(container, {
        childList: true,
        subtree: true
    });
}

// Initialize the observer when the page loads
document.addEventListener('DOMContentLoaded', prepareImagesForCapture);