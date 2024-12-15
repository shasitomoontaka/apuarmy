const apiKey = 'AIzaSyATYDPScmnIJ3T1dkj5P4_uJH-0dunkmyI';
const cseId = 'a7118a75b7f764754';
const baseQuery = 'Apu Apustaja';
const excludedKeywords = ['Pepe', 'Buy', 'Crypto', 'Memecoin', 'Shop', 'Shopping', 'Offer', 'Listing',];
const excludedWebsites = ['amazon.com', 'redbubble.com', 'openart.ai', 'mustreadalaska.com', 'attic.sh', 'emojis.sh',];
const randomMemeButton = document.getElementById('randomMemeButton');
const imageContainer = document.getElementById('imageContainer');
let imageUrls = [];
let fetchedUrls = new Set(); // To track already fetched URLs

randomMemeButton.addEventListener('click', async () => {
    const exclusionQuery = buildExclusionQuery();
    const searchQuery = `${baseQuery} ${exclusionQuery}`;
    await displayRandomMeme(searchQuery);
});

function buildExclusionQuery() {
    let exclusionQuery = '';
    excludedKeywords.forEach(keyword => {
        exclusionQuery += ` -${keyword}`;
    });
    excludedWebsites.forEach(website => {
        exclusionQuery += ` -site:${website}`;
    });
    return exclusionQuery;
}

async function displayRandomMeme(searchQuery) {
    // Fetch memes if there are no URLs left
    if (imageUrls.length === 0) {
        await fetchMemes(searchQuery);
    }
    
    const randomMemeUrl = getRandomMeme();
    if (randomMemeUrl) {
        const img = new Image();
        img.src = randomMemeUrl;
        img.alt = "Random Meme";
        img.onerror = async () => {
            console.warn('Meme failed to load, fetching a new one.');
            await displayRandomMeme(searchQuery);
        };
        img.onload = () => {
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
        };
    } else {
        console.warn('No meme found in the current fetch, retrying.');
        await displayRandomMeme(searchQuery);
    }
}

async function fetchMemes(searchQuery) {
    // Randomize the starting point to avoid fetching the same set of results
    const randomOffset = Math.floor(Math.random() * 69); // You can adjust this range
    const url = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&cx=${cseId}&searchType=image&key=${apiKey}&num=10&start=${randomOffset}`;
    console.log(`Fetching memes from: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Fetched data:', data);
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                if (!fetchedUrls.has(item.link)) { // Only add new URLs
                    imageUrls.push(item.link);
                    fetchedUrls.add(item.link); // Mark this URL as fetched
                }
            });
            console.log('Updated meme URLs:', imageUrls);
        } else {
            console.warn('No items found in the response.');
        }
    } catch (error) {
        console.error('Error fetching memes:', error);
    }
}

function getRandomMeme() {
    if (imageUrls.length === 0) {
        console.warn('No memes available in the array.');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls.splice(randomIndex, 1)[0]; // Remove the meme from the array once used
}
