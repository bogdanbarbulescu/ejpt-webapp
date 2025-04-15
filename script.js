// script.js

/**
 * Handles sidebar navigation clicks to show/hide content sections.
 */
document.addEventListener('DOMContentLoaded', function() {

    // Select all sidebar navigation links and content sections
    const sidebarLinks = document.querySelectorAll('#sidebar .list-group-item');
    const contentSections = document.querySelectorAll('#main-content .content-section');
    const mainContentArea = document.getElementById('main-content');

    /**
     * Shows the target content section and updates active states.
     * @param {string} targetId - The ID of the content section to show.
     */
    function showContent(targetId) {
        // Basic sanitization check for the targetId - ensure it's alphanumeric/hyphen/underscore
        // This prevents potential manipulation if targetId was ever constructed dynamically from unsafe sources.
        // For this static app, it's less critical but good practice.
        if (!/^[a-zA-Z0-9-_]+$/.test(targetId)) {
            console.error("Invalid target ID:", targetId);
            return; // Abort if the ID seems unsafe
        }

        // Hide all content sections first
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Deactivate all sidebar links
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Attempt to find and show the target content section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            console.warn(`Content section with ID "${targetId}" not found.`);
        }

        // Attempt to find and activate the corresponding sidebar link
        // Use attribute selector for safety against special characters in targetId
        const activeLink = document.querySelector(`#sidebar .list-group-item[data-target="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            console.warn(`Sidebar link with data-target "${targetId}" not found.`);
        }

        // Scroll the main content area to the top
        if (mainContentArea) {
            mainContentArea.scrollTop = 0;
        }
    }

    // Add click event listeners to all sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior (like jumping to '#')

            // Get the target section ID from the 'data-target' attribute
            const targetId = this.dataset.target; // Use dataset for cleaner access

            if (targetId) {
                showContent(targetId);

                // Optional: Update URL hash for bookmarking/history (basic implementation)
                // Be cautious with this if sections load dynamically via AJAX later
                // history.pushState(null, null, `#${targetId}`);
            } else {
                 console.error("Link clicked, but missing data-target attribute:", this);
            }
        });
    });

    // --- Initialization ---
    // Determine initial section (e.g., from URL hash or default)
    let initialTarget = 'methodology'; // Default section
    if (window.location.hash) {
        // Basic check to see if hash matches a known target
        const potentialTarget = window.location.hash.substring(1); // Remove '#'
         if (document.getElementById(potentialTarget)) {
             initialTarget = potentialTarget;
         }
    }

    // Show the initial content section
    showContent(initialTarget);

    // Optional: Add listener for browser back/forward buttons if using history.pushState
    // window.addEventListener('popstate', function() {
    //     let hashTarget = window.location.hash.substring(1) || 'methodology';
    //     showContent(hashTarget);
    // });

}); // End DOMContentLoaded