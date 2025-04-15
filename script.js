// script.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Navigation ---
    const sidebarLinks = document.querySelectorAll('#sidebar .list-group-item');
    const contentSections = document.querySelectorAll('#main-content .content-section');
    const mainContentArea = document.getElementById('main-content');

    function showContent(targetId) {
        if (!/^[a-zA-Z0-9-_]+$/.test(targetId)) {
            console.error("Invalid target ID:", targetId);
            return;
        }

        contentSections.forEach(section => section.classList.remove('active'));
        sidebarLinks.forEach(link => link.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Re-run Prism highlighting for the newly visible section if needed
            // Prism.highlightAllUnder(targetSection); // Usually not needed with autoloader
        } else {
            console.warn(`Content section with ID "${targetId}" not found.`);
        }

        const activeLink = document.querySelector(`#sidebar .list-group-item[data-target="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            console.warn(`Sidebar link with data-target "${targetId}" not found.`);
        }

        if (mainContentArea) {
            mainContentArea.scrollTop = 0;
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.dataset.target;
            if (targetId) {
                showContent(targetId);
                // Optional: history.pushState(null, null, `#${targetId}`);
            } else {
                 console.error("Link clicked, but missing data-target attribute:", this);
            }
        });
    });

    // --- Checklist Local Storage ---
    const checklistCheckboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const storageKey = 'ejptHelperCheckboxStates';

    // Load states from localStorage
    function loadCheckboxStates() {
        let savedStates = {};
        try {
            const storedValue = localStorage.getItem(storageKey);
            if (storedValue) {
                savedStates = JSON.parse(storedValue);
            }
        } catch (e) {
            console.error("Error reading checkbox states from localStorage:", e);
            // Clear potentially corrupted storage
            localStorage.removeItem(storageKey);
        }


        checklistCheckboxes.forEach(checkbox => {
            if (checkbox.id && savedStates.hasOwnProperty(checkbox.id)) {
                checkbox.checked = savedStates[checkbox.id];
            } else if (checkbox.id) {
                 // Optional: Default unchecked if not in storage
                 checkbox.checked = false;
            }
        });
        console.log("Checkbox states loaded.");
    }

    // Save state to localStorage
    function saveCheckboxState(checkboxId, isChecked) {
         let savedStates = {};
         try {
            const storedValue = localStorage.getItem(storageKey);
            if (storedValue) {
                savedStates = JSON.parse(storedValue);
            }
         } catch (e) {
             console.error("Error reading checkbox states before saving:", e);
             // Start fresh if storage was corrupted
             savedStates = {};
         }

        savedStates[checkboxId] = isChecked;

        try {
            localStorage.setItem(storageKey, JSON.stringify(savedStates));
        } catch (e) {
             console.error("Error saving checkbox state to localStorage:", e);
        }
    }

    // Add event listeners to checkboxes
    checklistCheckboxes.forEach(checkbox => {
        if (!checkbox.id) {
            console.warn("Checklist item found without an ID. State cannot be saved for:", checkbox.nextElementSibling?.textContent);
            return; // Skip checkboxes without IDs
        }
        checkbox.addEventListener('change', function() {
            saveCheckboxState(this.id, this.checked);
        });
    });

    // --- Initialization ---
    let initialTarget = 'methodology';
    if (window.location.hash) {
        const potentialTarget = window.location.hash.substring(1);
         if (document.getElementById(potentialTarget)) {
             initialTarget = potentialTarget;
         }
    }
    showContent(initialTarget); // Show initial content first
    loadCheckboxStates(); // Load checkbox states after content is potentially visible

    // Optional: Handle back/forward if using pushState
    // window.addEventListener('popstate', function() { ... });

    // Note: Prism.js Copy to Clipboard plugin handles its own button logic.
    // No extra JS needed here for the copy functionality itself.

}); // End DOMContentLoaded