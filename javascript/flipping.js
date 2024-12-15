
    const FRED_API_KEY = 'df110e3c6430a5271df07055fc2687cd';

    // Fetch and calculate chicken price (from pounds to kg)
    async function fetchChickenPrice() {
        try {
            const response = await fetch(`https://corsproxy.io/?https://api.stlouisfed.org/fred/series/observations?series_id=APU0000706111&api_key=${FRED_API_KEY}&file_type=json`);
            const data = await response.json();
            const pricePerLb = parseFloat(data.observations[data.observations.length - 1].value);
            const pricePerKg = pricePerLb * 2.20462; // Convert lbs to kg
            document.getElementById('chickentenders-price').textContent = `$${pricePerKg.toFixed(2)}`;
        } catch (error) {
            console.error('Error fetching chicken price:', error);
            document.getElementById('chickentenders-price').textContent = 'Error';
        }
    }

    // Fetch carrot price
	async function fetchCarrotPrice() {
		try {
			const response = await fetch(`https://corsproxy.io/?https://api.stlouisfed.org/fred/series/observations?series_id=APU0000712403&api_key=${FRED_API_KEY}&file_type=json`);
			const data = await response.json();
			if (data && data.observations && data.observations.length > 0) {
				const latestPrice = data.observations[data.observations.length - 1].value;
				const pricePerLb = parseFloat(latestPrice);  // Price per pound
				const pricePerKg = pricePerLb * 2.20462;  // Convert to price per kilogram (1 lb = 2.20462 lb)
	
				// Display the price for carrots per kilogram
				document.getElementById('carrots-price').textContent = `$${pricePerKg.toFixed(2)}`;
			} else {
				document.getElementById('carrots-price').textContent = 'Unavailable';
			}
		} catch (error) {
			console.error('Error fetching carrot price:', error);
			document.getElementById('carrots-price').textContent = 'Error';
		}
	}
	
	// Fetch Big Mac price for the USA
        async function fetchBigMacPrice() {
            try {
                // Fetch the Big Mac full index data from GitHub using CORS proxy
                const response = await fetch("https://corsproxy.io/?https://raw.githubusercontent.com/TheEconomist/big-mac-data/master/output-data/big-mac-full-index.csv");
                const csvText = await response.text();

                // Parse the CSV data into rows
                const rows = csvText.split("\n").map(row => row.split(","));

                // Extract headers and locate the latest USA data row
                const headers = rows[0];
                const dateIndex = headers.indexOf("date");
                const countryIndex = headers.indexOf("iso_a3");
                const priceIndex = headers.indexOf("dollar_price"); // USD equivalent price

                // Find the latest available USA data row
                const usaDataRows = rows.filter(row => row[countryIndex] === "USA");
                const latestUSARow = usaDataRows[usaDataRows.length - 1]; // Last row for USA data

                // Ensure we have found the USA row and valid price
                if (latestUSARow && latestUSARow[priceIndex]) {
                    const price = latestUSARow[priceIndex];
                    document.getElementById("bigmac-price").textContent = `$${parseFloat(price).toFixed(2)}`;
                } else {
                    document.getElementById("bigmac-price").textContent = "Unavailable";
                }
            } catch (error) {
                console.error("Error fetching Big Mac price:", error);
                document.getElementById("bigmac-price").textContent = "Error";
            }
        }
        
            // Fetch chocolate milk price (APU0000709112)
    async function fetchChocolateMilkPrice() {
        try {
            // Fetch the wholesale price of chocolate milk per gallon
            const response = await fetch(`https://corsproxy.io/?https://api.stlouisfed.org/fred/series/observations?series_id=APU0000709112&api_key=${FRED_API_KEY}&file_type=json`);
            const data = await response.json();
            
            if (data && data.observations && data.observations.length > 0) {
                const latestPrice = parseFloat(data.observations[data.observations.length - 1].value);

                // Convert the price from gallon to liter (1 gallon = 3.78541 liters)
                const pricePerLiter = latestPrice / 3.78541;

                // Multiply the price by 2 as requested
                const adjustedPrice = pricePerLiter * 2;

                // Display the price
                document.getElementById('chocolatemilk-price').textContent = `$${adjustedPrice.toFixed(2)}`;
            } else {
                document.getElementById('chocolatemilk-price').textContent = 'Unavailable';
            }
        } catch (error) {
            console.error('Error fetching chocolate milk price:', error);
            document.getElementById('chocolatemilk-price').textContent = 'Error';
        }
    }
    // Apu price
	async function fetchAPUData() {
		try {
			const response = await fetch('https://api.coingecko.com/api/v3/coins/apu-s-club');
			const data = await response.json();
	
			// Extracting the price and market cap for the coin
			const price = data.market_data.current_price.usd;
			const marketCap = data.market_data.market_cap.usd;
	
			// Format the price to 8 decimal places
			const formattedPrice = price.toFixed(8);
	
			// Format the market cap with commas for better readability
			const formattedMarketCap = marketCap.toLocaleString();
	
			// Display the values on the page
			document.getElementById('apu-price').textContent = `$${formattedPrice}`;
			document.getElementById('apu-marketcap').textContent = `$${formattedMarketCap}`;
		} catch (error) {
			console.error('Error fetching $APU data:', error);
			document.getElementById('apu-price').textContent = 'Error';
			document.getElementById('apu-marketcap').textContent = 'Error';
		}
	}
	
	// Stocks data
	
async function fetchStockData(symbol, priceElementId, marketCapElementId) {
  const apiKey = 'cslqud9r01qgp6njkm50cslqud9r01qgp6njkm5g'; // Your Finnhub API key

  try {
    // Get stock price data
    const priceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const priceData = await priceResponse.json();

    // Get company profile for market capitalization
    const profileResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
    const profileData = await profileResponse.json();

    if (priceData.c !== undefined && profileData.marketCapitalization !== undefined) {
      const currentPrice = priceData.c.toFixed(2);
      const marketCap = (profileData.marketCapitalization / 1000).toFixed(2); // In billions
	  // Store the market cap in the global variable for later use
            if (symbol === 'MCD') {
                mcdMarketCap = marketCap;  // Store McDonald's market cap
            } else if (symbol === 'DIS') {
                disMarketCap = marketCap;  // Store Disney's market cap
            }
      document.getElementById(priceElementId).textContent = `$${currentPrice}`;
      document.getElementById(marketCapElementId).textContent = `$${marketCap}B`;
    } else {
      document.getElementById(priceElementId).textContent = 'N/A';
      document.getElementById(marketCapElementId).textContent = 'N/A';
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} data:`, error);
    document.getElementById(priceElementId).textContent = 'Error';
    document.getElementById(marketCapElementId).textContent = 'Error';
  }
}

// Store prices
let apuPrice = 0;
let chocolateMilkPrice = 0;
let carrotPrice = 0;
let bigMacPrice = 0;
let chickenPrice = 0;
let apuMarketCap = 0;


// Update multiplier calculation to ensure both are in billions
function calculateMultipliers() {
    // Convert APU market cap to billions
    let apuMarketCapInBillions = apuMarketCap / 1e9;  // 1 billion = 1e9

    // Ensure APU price and market cap are valid
    if (apuPrice === 0 || apuMarketCapInBillions === 0) return;

    // Product price multipliers based on APU price
    document.getElementById('chocolatemilk-multiplier').textContent = (chocolateMilkPrice / apuPrice).toFixed(0);
    document.getElementById('carrots-multiplier').textContent = (carrotPrice / apuPrice).toFixed(0);
    document.getElementById('bigmac-multiplier').textContent = (bigMacPrice / apuPrice).toFixed(0);
    document.getElementById('chickentenders-multiplier').textContent = (chickenPrice / apuPrice).toFixed(0);

    // Stock price multipliers based on APU market cap (now in billions)
document.getElementById('mcd-multiplier').textContent = (mcdMarketCap / apuMarketCapInBillions).toFixed(0);
document.getElementById('dis-multiplier').textContent = (disMarketCap / apuMarketCapInBillions).toFixed(0);
}



async function fetchProductPrices() {
    try {
        // Fetch the APU price and market cap
        const responseAPU = await fetch('https://api.coingecko.com/api/v3/coins/apu-s-club');
        const dataAPU = await responseAPU.json();
        apuPrice = dataAPU.market_data.current_price.usd;
        apuMarketCap = dataAPU.market_data.market_cap.usd; // Market cap

        // Fetch other product prices
        chocolateMilkPrice = parseFloat(document.getElementById('chocolatemilk-price').textContent.replace('$', ''));
        carrotPrice = parseFloat(document.getElementById('carrots-price').textContent.replace('$', ''));
        bigMacPrice = parseFloat(document.getElementById('bigmac-price').textContent.replace('$', ''));
        chickenPrice = parseFloat(document.getElementById('chickentenders-price').textContent.replace('$', ''));
        mcdPrice = parseFloat(document.getElementById('mcdPrice').textContent.replace('$', ''));
        disPrice = parseFloat(document.getElementById('disPrice').textContent.replace('$', ''));

        // Call the calculation function after fetching all prices
        calculateMultipliers();
    } catch (error) {
        console.error('Error fetching product prices:', error);
    }
}

// Call this function after initializing everything
async function initializePage() {
    await fetchChickenPrice();
    await fetchStockData('MCD', 'mcdPrice', 'mcdMarketCap');
    await fetchStockData('DIS', 'disPrice', 'disMarketCap');  
    await fetchBigMacPrice();
    await fetchChocolateMilkPrice();
    await fetchCarrotPrice();
    await fetchAPUData();  // This should update apuPrice and apuMarketCap
    await fetchProductPrices();  // This will now calculate multipliers correctly
}



    // Initialize the page
    initializePage();

