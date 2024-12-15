// landingpage.js
console.log('Landing Page Script Loaded');

// RSS to JSON service URL
const landingRssFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://mirror.xyz/0x0817d53BFff5A2bf5B70b94962C06ab7A4f431ed/feed/atom');

// Function to fetch the RSS feed
async function fetchLandingRSSFeed(url) {
    console.log('Fetching RSS feed from:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch RSS feed: ${url}`);
        const data = await response.json();
        console.log('Fetched RSS data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return null;
    }
}

// Function to display the latest post titles in the landing page section
async function displayLandingPostTitles() {
    console.log('Displaying latest post titles on the landing page');
    const landingPostsSection = document.getElementById('landing-posts');
    if (!landingPostsSection) {
        console.error("Landing posts section not found!");
        return;
    }

    const rssData = await fetchLandingRSSFeed(landingRssFeedUrl);
    if (rssData && rssData.items) {
        const postsToDisplay = rssData.items.slice(0, 3);
        console.log("Posts to display:", postsToDisplay);

        postsToDisplay.forEach(post => {
            const listItem = document.createElement('li');
            const titleLink = document.createElement('a');
            titleLink.href = post.link;
            titleLink.textContent = post.title;
            titleLink.target = '_blank';
            listItem.appendChild(titleLink);
            landingPostsSection.appendChild(listItem);
        });

        console.log('Latest posts titles appended to the landing page section');
    } else {
        console.log('No posts found or failed to fetch RSS feed');
    }
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Landing page DOM fully loaded');
    displayLandingPostTitles();
});

console.log('Landing page script execution completed');
