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

// Function to fetch the latest posts from Steemit user
const steemitUsername = 'steemitblog';
const steemitApiUrl = `https://api.steemit.com/condenser_api.get_discussions_by_blog`;

async function fetchSteemitPosts(username) {
    try {
        const requestBody = {
            jsonrpc: "2.0",
            method: "condenser_api.get_discussions_by_blog",
            params: [{
                tag: username,
                limit: 3
            }],
            id: 1
        };

        const response = await fetch('https://api.steemit.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`Failed to fetch Steemit posts: ${response.status}`);
        
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error fetching Steemit posts:', error);
        return null;
    }
}

// Function to display the latest post titles in the Apuverse section
async function displayLatestPostTitles() {
    const apuverseContainer = document.getElementById('apuverse-posts');
    const posts = await fetchSteemitPosts(steemitUsername);
    
    if (posts && posts.length > 0) {
        apuverseContainer.innerHTML = ''; // Clear any existing content
        
        posts.forEach(post => {
            const listItem = document.createElement('li'); // Create a list item for each post
            const link = document.createElement('a'); // Create a link for the title
            link.href = `https://steemit.com/@${post.author}/${post.permlink}`; // Set the href to the post link
            link.textContent = post.title; // Set the text to the post title
            link.target = '_blank'; // Open in a new tab
            listItem.appendChild(link); // Append the link to the list item
            apuverseContainer.appendChild(listItem); // Append the list item to the Apuverse container
        });
    } else {
        console.log('No posts found or failed to fetch Steemit posts');
        // Display fallback message
        apuverseContainer.innerHTML = '<li>Unable to load recent posts</li>';
    }
}

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

	

