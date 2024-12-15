// mirrorxyz.js

// RSS to JSON service URL
const rssFeedUrlMirror = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://mirror.xyz/0x0817d53BFff5A2bf5B70b94962C06ab7A4f431ed/feed/atom');

// Function to fetch the RSS feed
async function fetchMirrorRSSFeed(url) {
    try {
        const response = await fetch(url); // Fetch the RSS feed as JSON
        if (!response.ok) throw new Error(`Failed to fetch RSS feed: ${url}`);
        const rssData = await response.json();
        console.log(rssData.items); // Log the 'items' array to see the post details
        return rssData; // Return the RSS feed as JSON
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return null;
    }
}

// Function to extract the image URL from the content field
function extractMirrorImageUrl(content) {
    const imgTagMatch = content.match(/<img\s+src="([^"]+)"\s*alt=""/); // Regex to find the image src
    return imgTagMatch ? imgTagMatch[1] : null; // Return the image URL if found, otherwise null
}

// Function to display the latest posts in the main content area
async function displayMirrorLatestPosts() {
    const mainContentContainer = document.getElementById('main-content'); // Main content container

    const rssData = await fetchMirrorRSSFeed(rssFeedUrlMirror); // Fetch the RSS feed
    if (rssData) {
        const mirrorPosts = rssData.items; // Get all posts from the feed

        const mirrorPostContainer = document.createElement('div'); // Container to hold post items
        mirrorPostContainer.classList.add('post-container'); // Add a class for styling

        mirrorPosts.forEach(post => {
            const imageUrl = extractMirrorImageUrl(post.content); // Extract the image URL from the content
            const postElement = createMirrorPostElement(post.title, post.link, imageUrl); // Create the post element with title, link, and image
            mirrorPostContainer.appendChild(postElement); // Append the post element to the container
        });

        // Append the list of posts to the main content container
        mainContentContainer.appendChild(mirrorPostContainer);
        console.log('All posts appended to the main content');
    } else {
        console.log('No posts found or failed to fetch RSS feed');
    }
}

// Function to create and append a post element with the title (h2) first, then the image
function createMirrorPostElement(title, url, imageUrl) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post-item');

    // Create the clickable h2 title (append first)
    const h2 = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = url;
    titleLink.textContent = title;
    titleLink.target = '_blank';
    h2.appendChild(titleLink);

    // Create the clickable image (append after the h2 title)
    let imgLink;
    if (imageUrl) {
        imgLink = document.createElement('a');
        imgLink.href = url;
        imgLink.target = '_blank';

        const img = document.createElement('img');
        img.src = imageUrl;  // Use the extracted image URL
        img.alt = title;
        imgLink.appendChild(img);
    }

    // Append the h2 first, then the image (if available)
    postDiv.appendChild(h2);  // Title is appended first
    if (imgLink) postDiv.appendChild(imgLink);  // Image is appended after the title

    return postDiv;
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayMirrorLatestPosts);
