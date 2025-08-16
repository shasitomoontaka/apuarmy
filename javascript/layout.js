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

// Function to fetch the latest posts from Steemit user using a working proxy
const steemitUsername = 'steemitblog';

async function fetchSteemitPosts(username) {
    try {
        // Using corsproxy.io which is more reliable for JSON APIs
        const proxyUrl = 'https://corsproxy.io/?';
        const steemitApiUrl = 'https://api.steemit.com';
        
        const requestBody = {
            jsonrpc: "2.0",
            method: "condenser_api.get_discussions_by_blog",
            params: [{
                tag: username,
                limit: 3,
                start_author: "",
                start_permlink: ""
            }],
            id: 1
        };

        const response = await fetch(proxyUrl + encodeURIComponent(steemitApiUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`Failed to fetch Steemit posts: ${response.status}`);
        
        const data = await response.json();
        
        if (data.result && data.result.length > 0) {
            return data.result;
        }
        
        throw new Error('No posts found in API response');
        
    } catch (error) {
        console.error('Primary method failed, trying alternative approach:', error);
        return await fetchSteemitPostsAlternative(username);
    }
}

// Alternative method using different proxy and approach
async function fetchSteemitPostsAlternative(username) {
    try {
        // Try using allorigins proxy with Steemit's web API
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const steemitUrl = `https://steemit.com/trending/${username}`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(steemitUrl));
        if (!response.ok) throw new Error(`Failed to fetch from alternative source: ${response.status}`);
        
        const data = await response.json();
        const htmlContent = data.contents;
        
        // Parse the HTML to extract post information (basic regex approach)
        const posts = extractPostsFromHTML(htmlContent, username);
        return posts.slice(0, 3);
        
    } catch (error) {
        console.error('Alternative method also failed:', error);
        return await fetchSteemitPostsFallback(username);
    }
}

// Fallback method using a different approach
async function fetchSteemitPostsFallback(username) {
    try {
        // Using another working proxy
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const hiveSqlApi = 'https://api.hive.blog';
        
        const requestBody = {
            jsonrpc: "2.0",
            method: "condenser_api.get_discussions_by_blog",
            params: [{
                tag: username,
                limit: 3
            }],
            id: 1
        };

        const response = await fetch(proxyUrl + hiveSqlApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`Fallback method failed: ${response.status}`);
        
        const data = await response.json();
        return data.result || [];
        
    } catch (error) {
        console.error('All methods failed:', error);
        return [];
    }
}

// Helper function to extract posts from HTML (for alternative method)
function extractPostsFromHTML(html, username) {
    const posts = [];
    try {
        // Simple regex to find post titles and permalinks in Steemit HTML
        const postPattern = /<a[^>]+href="\/(@[^\/]+\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
        let match;
        
        while ((match = postPattern.exec(html)) !== null && posts.length < 3) {
            const [, permalink, title] = match;
            if (permalink.includes(`@${username}`)) {
                posts.push({
                    title: title.trim(),
                    permlink: permalink.replace(`@${username}/`, ''),
                    author: username
                });
            }
        }
    } catch (error) {
        console.error('Error parsing HTML:', error);
    }
    return posts;
}

// Function to display the latest post titles in the Apuverse section
async function displayLatestPostTitles() {
    const apuverseContainer = document.getElementById('apuverse-posts');
    
    // Show loading message
    apuverseContainer.innerHTML = '<li>Loading latest posts...</li>';
    
    const posts = await fetchSteemitPosts(steemitUsername);
    
    if (posts && posts.length > 0) {
        apuverseContainer.innerHTML = ''; // Clear loading message
        
        posts.forEach(post => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            // Construct the Steemit URL
            const postUrl = `https://steemit.com/@${post.author}/${post.permlink}`;
            
            link.href = postUrl;
            link.textContent = post.title || 'Untitled Post';
            link.target = '_blank';
            link.rel = 'noopener noreferrer'; // Security best practice
            
            listItem.appendChild(link);
            apuverseContainer.appendChild(listItem);
        });
        
        console.log(`Successfully loaded ${posts.length} posts from @${steemitUsername}`);
    } else {
        console.log('No posts found or failed to fetch Steemit posts');
        apuverseContainer.innerHTML = '<li>Unable to load recent posts at this time</li>';
    }
}

// Initialize the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayLatestPostTitles();
});

// Optional: Refresh posts every 10 minutes
setInterval(displayLatestPostTitles, 10 * 60 * 1000);

// Load the header, sidebar, and footer when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadHTML('header', 'header.html');
    loadHTML('sidebar', 'sidebar.html');
    loadHTML('footer', 'footer.html');

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

// hide .html extension in browser
if (window.location.pathname.endsWith('.html')) {
    const newPath = window.location.pathname.slice(0, -5); // remove .html
    window.history.replaceState(null, '', newPath);
}

	

