// sidebarblog.js
console.log('Script loaded');

// RSS to JSON service URL
const rssFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://mirror.xyz/0x0817d53BFff5A2bf5B70b94962C06ab7A4f431ed/feed/atom');

// Function to fetch the RSS feed
async function fetchRSSFeed(url) {
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

// Function to display the latest post titles in the Apuverse section of the sidebar
async function displayLatestPostTitles() {
    console.log('Displaying latest post titles');
    const apuverseSection = document.getElementById('apuverse-posts');
    if (!apuverseSection) {
        console.error("Apuverse section not found!");
        return;
    }

    const rssData = await fetchRSSFeed(rssFeedUrl);
    if (rssData && rssData.items) {
        const posts = rssData.items.slice(0, 3);
        console.log("Posts to display:", posts);

        posts.forEach(post => {
            const listItem = document.createElement('li');
            const titleLink = document.createElement('a');
            titleLink.href = post.link;
            titleLink.textContent = post.title;
            titleLink.target = '_blank';
            listItem.appendChild(titleLink);
            apuverseSection.appendChild(listItem);
        });

        console.log('Latest posts titles appended to the Apuverse section');
    } else {
        console.log('No posts found or failed to fetch RSS feed');
    }
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    displayLatestPostTitles();
});

console.log('Script execution completed');