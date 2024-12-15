// insults.js

// Function to fetch a random insult
function fetchInsult() {
    const proxyUrl = 'https://corsproxy.io/?'; // CORS proxy URL
    const apiUrl = 'https://www.yomama-jokes.com/api/v1/jokes/random/'; // Yo Mama Jokes API URL

    // Construct a unique URL to prevent caching
    const url = proxyUrl + encodeURIComponent(apiUrl + '?_=' + new Date().getTime());

    // Fetch the insult using the proxy
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Get the response as JSON
        })
        .then(data => {
            const jokeData = data; // Use the data directly, as the API returns a JSON object

            // Replace terms in the joke
            const insult = jokeData.joke
                .replace(/Yo Mama/gi, 'Apu') // Replace "Yo Mama" with "Apu"
                .replace(/she/gi, 'he') // Replace "she" with "he"
                .replace(/\b(her|hers)\b/gi, 'his'); // Replace standalone "her" or "hers" with "his"

            displayInsult(insult); // Display the modified insult
        })
        .catch(error => {
            console.error('Error fetching insult:', error);
        });
}

// Function to display the insult in the container
function displayInsult(insult) {
    const insultDisplay = document.getElementById('insult-display');
    insultDisplay.textContent = insult; // Set the insult text
}

// Attach event listener to the button
document.getElementById('fetch-insult').addEventListener('click', fetchInsult);
