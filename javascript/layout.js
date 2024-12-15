// Function to load external HTML content into an element
function loadHTML(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Check if the loaded content is for the sidebar
            if (id === 'sidebar') {
                displayLatestPostTitles(); // Call the function to display latest posts
            }
        })
        .catch(error => console.log('Error loading file: ', error));
}

// Function to fetch the latest posts from the RSS feed
const rssFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://mirror.xyz/0x0817d53BFff5A2bf5B70b94962C06ab7A4f431ed/feed/atom');

async function fetchRSSFeed(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch RSS feed: ${url}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return null;
    }
}

// Function to display the latest post titles in the Apuverse section
async function displayLatestPostTitles() {
    const apuverseContainer = document.getElementById('apuverse-posts');
    const rssData = await fetchRSSFeed(rssFeedUrl);
    if (rssData) {
        const posts = rssData.items.slice(0, 3); // Get the latest 3 posts
        apuverseContainer.innerHTML = ''; // Clear any existing content
        posts.forEach(post => {
            const listItem = document.createElement('li'); // Create a list item for each post
            const link = document.createElement('a'); // Create a link for the title
            link.href = post.link; // Set the href to the post link
            link.textContent = post.title; // Set the text to the post title
            link.target = '_blank'; // Open in a new tab
            listItem.appendChild(link); // Append the link to the list item
            apuverseContainer.appendChild(listItem); // Append the list item to the Apuverse container
        });
    } else {
        console.log('No posts found or failed to fetch RSS feed');
    }
}

// Load the header, sidebar, and footer when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadHTML('header', '/header.html');
    loadHTML('sidebar', '/sidebar.html');
    loadHTML('footer', '/footer.html');

    // Add event listener for burger menu
    const burgerMenu = document.querySelector('.burger-menu');
    if (burgerMenu) {
        burgerMenu.addEventListener('click', toggleNav);
    }
});

// Toggle the burger menu
function toggleNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

	


