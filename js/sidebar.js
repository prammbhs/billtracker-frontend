/**
 * Sidebar navigation handler for BillTracker application
 * This script automatically sets the active state based on current page
 */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Get the current page URL path
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop();
        
        // If we're at the root or index, set dashboard as active
        const pageName = filename === '' || filename === '/' ? 'index.html' : filename;
        
        // Find all navigation links
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        
        // Remove any existing active classes
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Set active class for the current page
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === pageName) {
                link.classList.add('active');
            }
        });
        
        // Ensure the sidebar has the BillTracker title
        const logoContainer = document.querySelector('.sidebar .logo-container');
        if (logoContainer && !logoContainer.innerHTML.trim()) {
            logoContainer.innerHTML = '<h4><i class="fas fa-receipt mr-2"></i> BillTracker</h4>';
        }
    }, 50); // Small delay to ensure DOM is fully loaded and processed
});
