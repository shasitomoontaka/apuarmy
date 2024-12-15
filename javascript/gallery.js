        const gallery = document.getElementById('gallery');
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const imagePrefix = '/images/gallery/Apu Apustaja Meme ';  // Image folder path and name prefix
        const imageExtension = '.jpg';  // Image extension
        const imageCount = 99;  // Total number of images (1-99)

        // Object to store images categorized by type
        const imageGroups = {
            square: [],
            landscape: [],
            portrait: []
        };

        // Function to load images
        function loadImages() {
            for (let i = 1; i <= imageCount; i++) {
                const imagePath = `${imagePrefix}${i}${imageExtension}`;

                // Create an image element and set the source
                const img = new Image();
                img.src = imagePath;
                img.alt = `Image ${i}`;

                // Check if the image exists by using the "onerror" handler
                img.onerror = function() {
                    // If image fails to load (404), just skip it
                    console.log(`Skipping missing image: ${imagePath}`);
                };

                // If image exists, classify it by dimensions
                img.onload = function() {
                    const width = img.width;
                    const height = img.height;

                    // Classify based on dimensions
                    if (width === height) {
                        imageGroups.square.push(img);  // Square image
                    } else if (width > height) {
                        imageGroups.landscape.push(img);  // Landscape image
                    } else {
                        imageGroups.portrait.push(img);  // Portrait image
                    }
                };
            }
        }

        // Function to sort and display images grouped by type and order by the number of images
        function displayImages() {
            // Create an array of group names sorted by number of images (largest group first)
            const sortedGroups = Object.keys(imageGroups)
                .map(group => ({ name: group, images: imageGroups[group] }))
                .sort((a, b) => b.images.length - a.images.length);  // Sort by the number of images in descending order

            // Loop through sorted groups and display them
            sortedGroups.forEach(group => {
                if (group.images.length > 0) {
                    // Create a container for images in the group
                    const groupImages = document.createElement('div');
                    groupImages.classList.add('gallery-images');

                    // Add images to the group container
                    group.images.forEach(img => {
                        const galleryItem = document.createElement('div');
                        galleryItem.classList.add('gallery-item');
                        galleryItem.appendChild(img);
                        groupImages.appendChild(galleryItem);

                        // Open the full image in a modal when clicked
                        galleryItem.addEventListener('click', () => {
                            modal.style.display = 'flex';
                            modalImg.src = img.src;  // Set the full image path in the modal
                        });
                    });

                    // Append the group container to the gallery section
                    gallery.appendChild(groupImages);
                }
            });
        }

        // Close the modal when clicked
        modal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Load images and display them after all are loaded
        window.onload = function() {
            loadImages();

            // Wait a bit for images to be classified, then display
            setTimeout(displayImages, 1000);  // Adjust timing if needed (waiting for images to load)
        };