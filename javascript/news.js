document.addEventListener("DOMContentLoaded", () => {
    const headlineInput = document.getElementById("news-headline");
    const descriptionInput = document.getElementById("news-description");
    const applyTextButton = document.getElementById("news-apply-text-btn");
    const randomButton = document.getElementById("news-random-btn");
    const downloadButton = document.getElementById("news-download-btn");
    const thumbnails = document.querySelectorAll(".news-thumbnail");
    const canvasBackground = document.getElementById("news-canvas-background");
    const headlineDiv = document.getElementById("news-headline-div");
    const descriptionDiv = document.getElementById("news-description-div");
    const timestamp = document.getElementById("news-timestamp");
    const imageInput = document.getElementById("news-image-input");
    const imageDiv = document.getElementById("news-image-div");

    // Random text generator
    const headlines = ["Breaking News: Apu Lubs You!", "Sports Update: $APU Starts Running!", "Weather Alert: It's Raining Frogs", "JUST IN: $APU About to Flip Disney","Crypto News: $APU Giga Pump!","Crypto News: Frens Buy $APU!","GM Fren: Spread the Love!","Headline: $APU Takes Over!","GM Fren: Apu Unites Frens!","Market Watch: $APU Rallies!","Crypto News: $APU Giga Pump!","News Alert: Carrots in Demand!","Fren News: GM Wins the Day!","Crypto Buzz: $APU Giga Sends!","Fren News: Free Chibben Today!","Tech Update: Visit Apu.com Now!","Fren News: Follow @ApusCoin on Twibber!","Fren News: Follow Frens on Twibber!","JUST IN: Frens Winning Bigly Again",];
    const descriptions = ["Experts predict $APU to 69 Billion USD", "Frens celebrate another successful GM", "Officials advise to GM daily","$APU token to see massive growth!","Apu about to flip Disney soon!","Chibben giveaway live on Apu.com!","Choccy Milk sales reach new highs!","Carrots become a global trendsetter!","Now’s the time to grab your $APU!","$APU sets a historic market record!","Start your mornings right with GM!","$APU token shakes up the market!","Spread GM vibes with frens daily!","Apu ensures carrot supplies last!","Apu brings frens together worldwide!","Frens unite for GM Day celebrations!","$APU’s momentum breaks all records!","Apu hype grows across all platforms!","$APU surges in global crypto rankings!","Carrots are now the Fren favorite!","Choccy Milk frenzy takes over!","GM and Frens spark a joyful wave!","Apu welcomes all frens to join!","Carrots see record-breaking demand!",];

    randomButton.addEventListener("click", () => {
        headlineInput.value = headlines[Math.floor(Math.random() * headlines.length)];
        descriptionInput.value = descriptions[Math.floor(Math.random() * descriptions.length)];
        headlineDiv.textContent = headlineInput.value;
        descriptionDiv.textContent = descriptionInput.value;
    });

    // Apply user input text to canvas
    applyTextButton.addEventListener("click", () => {
        headlineDiv.textContent = headlineInput.value;
        descriptionDiv.textContent = descriptionInput.value;
    });

    // Change background on thumbnail click
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
            canvasBackground.src = thumbnail.src;
            thumbnails.forEach((thumb) => thumb.classList.remove("selected"));
            thumbnail.classList.add("selected");
        });
    });

    // Set current date
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    timestamp.textContent = dateString;

    // Upload and display an image in the canvas
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.src = e.target.result;
                imageDiv.innerHTML = ""; // Clear any existing image
                imageDiv.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // Download canvas as image
    downloadButton.addEventListener("click", () => {
        const canvas = document.getElementById("news-canvas-container");
        html2canvas(canvas).then((canvas) => {
            const link = document.createElement("a");
            link.download = "news-image.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});
