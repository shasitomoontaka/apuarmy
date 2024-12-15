// jokes.js

// Function to fetch a random Chuck Norris joke
function fetchJoke() {
    fetch('https://api.chucknorris.io/jokes/random')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Replace terms with "Apu" using regular expressions
            const joke = data.value
                .replace(/Chuck Norris/gi, 'Apu')  // Replace "Chuck Norris" (case insensitive)
                .replace(/Chuck/gi, 'Apu')          // Replace "Chuck" (case insensitive)
                .replace(/Norris/gi, 'Apu');         // Replace "Norris" (case insensitive)

            displayJoke(joke);
        })
        .catch(error => {
            console.error('Error fetching joke:', error);
        });
}

// Function to display the joke in the container
function displayJoke(joke) {
    const jokeDisplay = document.getElementById('joke-display');
    jokeDisplay.textContent = joke; // Set the joke text
}

// Attach event listener to the button
document.getElementById('fetch-joke').addEventListener('click', fetchJoke);
