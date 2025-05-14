const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

// Initial settings
let bgColor = '#558a36';
let textColor = '#ffffff';
let fontSize = 100;
let fontFamily = 'Arial';
let font = `bold ${fontSize}px ${fontFamily}`;
let showApu = false;
let apuImage = new Image();

// Preload Apu0.png
const apu0Image = new Image();
apu0Image.src = 'images/gm/Apu0.png';
apu0Image.onload = () => {
  drawCanvas();
};

// List of available Apu images (Apu1.png to Apu41.png)
const apuImages = Array.from({ length: 41 }, (_, i) => `images/gm/Apu${i + 1}.png`);

// List of font families
const fontFamilies = [
  'Arial', 'Verdana', 'Georgia', 'Courier New', 'Comic Sans MS', 'Impact',
  'Times New Roman', 'Trebuchet MS', 'Lucida Console', 'Tahoma', 'Palatino Linotype',
  'Segoe UI', 'Helvetica', 'Garamond', 'Brush Script MT'
];

// Draw the canvas
function drawCanvas() {
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Apu0.png at top-left
  if (apu0Image.complete) {
    const maxWidth = canvas.width * 0.3; // 30% of canvas width
    const maxHeight = canvas.height * 0.3; // 30% of canvas height
    let imgWidth = apu0Image.width;
    let imgHeight = apu0Image.height;

    // Calculate scaling factor to maintain aspect ratio
    const widthRatio = maxWidth / imgWidth;
    const heightRatio = maxHeight / imgHeight;
    const scale = Math.min(widthRatio, heightRatio);

    imgWidth *= scale;
    imgHeight *= scale;

    const x = 0; // Top-left corner
    const y = 0; // Top-left corner
    ctx.drawImage(apu0Image, x, y, imgWidth, imgHeight);
  }
  // Text
  ctx.fillStyle = textColor;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GM', canvas.width / 2, canvas.height / 2);

  // Apu image
  if (showApu && apuImage.complete) {
    const maxWidth = canvas.width * 0.5; // 30% of canvas width
    const maxHeight = canvas.height * 0.5; // 30% of canvas height
    let imgWidth = apuImage.width;
    let imgHeight = apuImage.height;

    // Calculate scaling factor to maintain aspect ratio
    const widthRatio = maxWidth / imgWidth;
    const heightRatio = maxHeight / imgHeight;
    const scale = Math.min(widthRatio, heightRatio);

    imgWidth *= scale;
    imgHeight *= scale;

    const x = canvas.width - imgWidth;
    const y = canvas.height - imgHeight;
    ctx.drawImage(apuImage, x, y, imgWidth, imgHeight);
  }
}

// Generate random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
}

// Event listeners
document.getElementById('randomizeBtn').addEventListener('click', () => {
  bgColor = getRandomColor();
  textColor = getRandomColor();
  fontSize = Math.floor(Math.random() * (200 - 50 + 1)) + 50; // Random size between 50 and 200
  const randomIndex = Math.floor(Math.random() * fontFamilies.length);
  fontFamily = fontFamilies[randomIndex];
  font = `bold ${fontSize}px ${fontFamily}`;
  document.getElementById('bgColorPicker').value = bgColor;
  document.getElementById('textColorPicker').value = textColor;
  document.getElementById('fontSizeSlider').value = fontSize;
  drawCanvas();
});

document.getElementById('addApuBtn').addEventListener('click', () => {
  showApu = true;
  const randomIndex = Math.floor(Math.random() * apuImages.length);
  apuImage.src = apuImages[randomIndex];
  apuImage.onload = drawCanvas;
});

document.getElementById('randomFontBtn').addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * fontFamilies.length);
  fontFamily = fontFamilies[randomIndex];
  font = `bold ${fontSize}px ${fontFamily}`;
  drawCanvas();
});

document.getElementById('defaultBtn').addEventListener('click', () => {
  bgColor = '#558a36';
  textColor = '#ffffff';
  fontSize = 100;
  fontFamily = 'Arial';
  font = `bold ${fontSize}px ${fontFamily}`;
  showApu = false;
  document.getElementById('bgColorPicker').value = bgColor;
  document.getElementById('textColorPicker').value = textColor;
  document.getElementById('fontSizeSlider').value = fontSize;
  drawCanvas();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'gm-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Real-time updates
document.getElementById('bgColorPicker').addEventListener('input', (e) => {
  bgColor = e.target.value;
  drawCanvas();
});

document.getElementById('textColorPicker').addEventListener('input', (e) => {
  textColor = e.target.value;
  drawCanvas();
});

document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
  fontSize = e.target.value;
  font = `bold ${fontSize}px ${fontFamily}`;
  drawCanvas();
});

// Initial draw
// The canvas will be drawn once apu0Image has loaded
