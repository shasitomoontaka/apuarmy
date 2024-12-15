// Event listener to hide the button on click or hover
document.getElementById('sell-button').addEventListener('click', function() {
    this.style.opacity = '0'; // Set button to be invisible
});

document.getElementById('sell-button').addEventListener('mouseover', function() {
    this.style.opacity = '0'; // Set button to be invisible on mouse over
});

// Event listener to show the button again on mouse leave
document.getElementById('sell-button').addEventListener('mouseleave', function() {
    this.style.opacity = '1'; // Make the button visible again when mouse leaves
});

// Fetch the current price of $Apu in USD
async function fetchApuPrice() {
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=apu-s-club&vs_currencies=usd';
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data['apu-s-club'].usd; // Return the price of $Apu in USD
}

// Fetch the list of meme category coins
async function fetchMemeCoins() {
    const memeCoinsUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=250&page=1&sparkline=false'; // Fetch meme coins market data

    // Fetch meme coins
    const response = await fetch(memeCoinsUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const memeCoins = await response.json();
    
    return memeCoins; // Return the list of meme coins
}

// Function to display meme coins
async function displayMemeCoins() {
    try {
        const apuPriceInUSD = await fetchApuPrice(); // Get $Apu price
        const memeCoins = await fetchMemeCoins(); // Get meme coins
        
        const coinsList = document.getElementById('meme-coins-list'); // Get the table body element
        coinsList.innerHTML = ''; // Clear the table

        memeCoins.forEach(coin => {
            const priceInApu = coin.current_price / apuPriceInUSD; // Convert USD price to $Apu
            let formattedPrice;

            // Conditional formatting for the price display
            if (priceInApu < 0.01) {
                // Display in scientific notation for very small numbers
                formattedPrice = priceInApu.toExponential(2); // 2 decimal places in scientific notation
            } else if (priceInApu >= 100000) {
                // Display in scientific notation for very large numbers
                formattedPrice = priceInApu.toExponential(2); // 2 decimal places in scientific notation
            } else {
                // Round and format normally for moderate values
                formattedPrice = priceInApu.toFixed(2); // 2 decimal places
            }

            const listItem = document.createElement('tr'); // Create a new table row
            listItem.innerHTML = `<td>${coin.name} (${coin.symbol.toUpperCase()})</td><td>${formattedPrice}</td>`; // Add coin name and formatted price to the row
            listItem.setAttribute('data-name', coin.name.toLowerCase()); // Set data attribute for filtering
            coinsList.appendChild(listItem); // Add the coin to the table
        });

        // Attach the search event listener after the coins are displayed
        initializeSearch();
    } catch (error) {
        console.error('Error fetching meme coins:', error);
    }
}


// Function to filter the displayed meme coins based on the search input
function initializeSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function() {
        const query = this.value.toLowerCase(); // Get the search input
        const coinsList = document.getElementById('meme-coins-list');
        const coins = coinsList.getElementsByTagName('tr'); // Get all rows in the table

        // Loop through the table rows and display/hide based on the search query
        for (let i = 0; i < coins.length; i++) {
            const coinName = coins[i].getAttribute('data-name'); // Get the name from the data attribute
            if (coinName.includes(query)) {
                coins[i].style.display = ''; // Show the row
            } else {
                coins[i].style.display = 'none'; // Hide the row
            }
        }
    });
}

// Call displayMemeCoins function on page load
document.addEventListener('DOMContentLoaded', displayMemeCoins);
