/**
 * Sidebar navigation handler for BillTracker application
 * This script automatically sets the active state based on current page
 * and implements a hamburger menu for mobile devices
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
        
        // Setup hamburger menu for mobile - with a fix to ensure it works
        setupHamburgerMenu();
    }, 50); // Small delay to ensure DOM is fully loaded and processed

    // Additional fix: Force the hamburger to appear on all pages
    // This addresses edge cases where it might be hidden
    setTimeout(function() {
        if (window.innerWidth <= 576) {
            const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
            if (hamburgerBtn) {
                hamburgerBtn.style.display = 'flex';
                hamburgerBtn.style.zIndex = '9999';
            }
        }
    }, 500);

    // Setup hamburger menu for mobile - immediate execution to ensure it's available on all pages
    setupHamburgerMenu();
    
    // Force the hamburger to appear on all pages with multiple attempts
    setTimeout(function() {
        if (window.innerWidth <= 576) {
            forceShowHamburger();
        }
    }, 200);
    
    setTimeout(function() {
        if (window.innerWidth <= 576) {
            forceShowHamburger();
        }
    }, 500);
    
    setTimeout(function() {
        if (window.innerWidth <= 576) {
            forceShowHamburger();
        }
    }, 1000);
});

/**
 * Helper function to ensure hamburger is visible
 */
function forceShowHamburger() {
    const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
    if (hamburgerBtn) {
        hamburgerBtn.style.display = 'flex';
        hamburgerBtn.style.visibility = 'visible';
        hamburgerBtn.style.opacity = '1';
        hamburgerBtn.style.zIndex = '99999';
        
        // Force reset any default mobile navigation that might be conflicting
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            // Check if sidebar has a bottom position styling which indicates it's using the bottom nav pattern
            const computedStyle = window.getComputedStyle(sidebar);
            if (computedStyle.bottom !== 'auto' && computedStyle.bottom !== '') {
                sidebar.style.display = 'none'; // Hide the default bottom nav
            }
        }
    } else {
        // If button doesn't exist, create it
        setupHamburgerMenu();
    }
}

/**
 * Sets up hamburger menu for mobile view
 */
function setupHamburgerMenu() {
    // Force immediate application regardless of width detection for testing
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !mainContent) return;
    
    // Remove any existing hamburger buttons to avoid duplicates
    const existingBtn = document.querySelector('.hamburger-menu-btn');
    if (existingBtn) existingBtn.remove();
    
    const existingOverlay = document.querySelector('.sidebar-overlay');
    if (existingOverlay) existingOverlay.remove();
    
    // Create hamburger menu button with explicit styling
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'hamburger-menu-btn';
    hamburgerBtn.id = 'hamburgerMenuBtn'; // Add ID for easier selection
    hamburgerBtn.setAttribute('aria-label', 'Toggle navigation menu');
    hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
    hamburgerBtn.style.position = 'fixed';
    hamburgerBtn.style.top = '20px';
    hamburgerBtn.style.right = '20px'; // Changed from left to right
    hamburgerBtn.style.width = '40px';
    hamburgerBtn.style.height = '40px';
    hamburgerBtn.style.backgroundColor = '#4361ee'; // Primary color
    hamburgerBtn.style.color = 'white';
    hamburgerBtn.style.border = 'none';
    hamburgerBtn.style.borderRadius = '50%';
    hamburgerBtn.style.display = 'flex';
    hamburgerBtn.style.alignItems = 'center';
    hamburgerBtn.style.justifyContent = 'center';
    hamburgerBtn.style.cursor = 'pointer';
    hamburgerBtn.style.zIndex = '99999'; // Ultra-high z-index to ensure visibility
    hamburgerBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    hamburgerBtn.style.opacity = '1'; // Ensure it's fully visible
    hamburgerBtn.style.visibility = 'visible'; // Ensure it's visible
    
    // Create overlay for when sidebar is open
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebarOverlay'; // Add ID for easier selection
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '99990'; // Extremely high z-index
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    overlay.style.transition = 'opacity 0.3s ease-in-out';
    
    // Insert at the beginning of body to avoid being hidden
    body.insertBefore(hamburgerBtn, body.firstChild);
    body.insertBefore(overlay, body.firstChild);
    
    // Override any potential CSS that might hide the button
    document.head.insertAdjacentHTML('beforeend', `
        <style id="hamburger-override-styles">
            .hamburger-menu-btn {
                display: none !important;
            }
            
            @media (max-width: 576px) {
                .hamburger-menu-btn {
                    display: flex !important;
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    z-index: 99999 !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 40px !important;
                    height: 40px !important;
                }
                
                /* For theme switch button compatibility */
                .theme-switch {
                    top: 20px !important;
                    right: 70px !important; /* Move to the left of hamburger */
                }
            }
        </style>
    `);
    
    // Add specific styling to the sidebar for mobile
    sidebar.style.transition = 'transform 0.3s ease-in-out';
    
    // Hide button on desktop, show on mobile
    if (window.innerWidth > 576) {
        hamburgerBtn.style.display = 'none';
    } else {
        // Mobile setup
        // Initial state - sidebar is hidden on mobile
        sidebar.classList.add('mobile-hidden');
        sidebar.style.transform = 'translateX(100%)'; // Changed to slide from right
        sidebar.style.right = '0'; // Position to right
        sidebar.style.left = 'auto'; // Reset left
        mainContent.style.marginLeft = '0';
        hamburgerBtn.style.display = 'flex';
    }
    
    // Toggle sidebar when hamburger is clicked
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        
        if (sidebar.classList.contains('mobile-hidden')) {
            sidebar.classList.remove('mobile-hidden');
            sidebar.classList.add('mobile-visible');
            sidebar.style.transform = 'translateX(0)';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            hamburgerBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            sidebar.classList.add('mobile-hidden');
            sidebar.classList.remove('mobile-visible');
            sidebar.style.transform = 'translateX(100%)'; // Changed to slide to right
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close sidebar when overlay is clicked
    overlay.addEventListener('click', function() {
        sidebar.classList.add('mobile-hidden');
        sidebar.classList.remove('mobile-visible');
        sidebar.style.transform = 'translateX(100%)'; // Changed to slide to right
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
    
    // Close sidebar when a menu item is clicked
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 576) {
                sidebar.classList.add('mobile-hidden');
                sidebar.classList.remove('mobile-visible');
                sidebar.style.transform = 'translateX(100%)'; // Changed to slide to right
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Add necessary CSS for hamburger menu
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 576px) {
            .sidebar {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important; /* Changed from left to right */
                left: auto !important; /* Reset left property */
                height: 100vh !important;
                width: 250px !important;
                z-index: 99991 !important;
                transform: translateX(100%) !important; /* Changed to slide from right */
                display: block !important;
                flex-direction: column !important;
                padding-top: 20px !important;
                background-color: var(--dark-color) !important;
                box-shadow: 0 0 15px rgba(0,0,0,0.2) !important;
            }
            
            .sidebar.mobile-visible {
                transform: translateX(0) !important;
            }
            
            .sidebar .nav {
                flex-direction: column !important;
                width: 100% !important;
                padding: 0 !important;
            }
            
            .sidebar .nav-item {
                width: 100% !important;
            }
            
            .sidebar .nav-link {
                padding: 12px 25px !important;
                text-align: left !important;
                height: auto !important;
                flex-direction: row !important;
                border-radius: 30px 0 0 30px !important; /* Changed border radius to match right side */
                display: flex !important;
            }
            
            .sidebar .nav-link i {
                margin-right: 15px !important;
                font-size: 1rem !important;
            }
            
            .sidebar .nav-link span {
                display: inline !important;
                font-size: 1rem !important;
            }
            
            .sidebar .logo-container {
                display: flex !important;
                padding: 15px 25px !important;
                margin-bottom: 25px !important;
            }
            
            .main-content {
                margin-left: 0 !important;
                padding-bottom: 20px !important;
                padding-top: 70px !important;
            }
            
            .dark-mode .hamburger-menu-btn {
                background-color: var(--light-color) !important;
                color: var(--dark-color) !important;
            }
            
            /* Force hide any bottom navigation bars that might be in other pages */
            .sidebar[style*="bottom: 0"],
            .sidebar[style*="height: 60px"] {
                display: none !important;
            }
            
            /* Override the bottom sidebar styling completely */
            .sidebar {
                bottom: auto !important;
                height: 100vh !important;
            }
            
            /* Hide any bottom navigation that might be conflicting */
            .sidebar:not(.mobile-visible) {
                display: block !important;
                transform: translateX(100%) !important; /* Changed to slide to right */
            }
            
            /* Adjust theme switch button position to not conflict with hamburger */
            .theme-switch {
                top: 20px !important;
                right: 70px !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Force the hamburger to be visible on mobile
    if (window.innerWidth <= 576) {
        hamburgerBtn.style.display = 'flex';
    }
}

// Add window resize listener to handle navigation changes when resizing
window.addEventListener('resize', function() {
    // Simple debounce implementation
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(function() {
        // Simply update the visibility without reloading
        const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
        if (hamburgerBtn) {
            if (window.innerWidth <= 576) {
                hamburgerBtn.style.display = 'flex';
                hamburgerBtn.style.visibility = 'visible';
                hamburgerBtn.style.opacity = '1';
                
                // Check for bottom navbar and hide it
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    const computedStyle = window.getComputedStyle(sidebar);
                    if (computedStyle.bottom !== 'auto' && computedStyle.bottom !== '') {
                        sidebar.style.display = 'none'; // Hide the default bottom nav
                    }
                }
            } else {
                hamburgerBtn.style.display = 'none';
                // Reset sidebar position for desktop
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.style.transform = '';
                    sidebar.style.display = ''; // Reset display
                    sidebar.classList.remove('mobile-hidden', 'mobile-visible');
                }
                // Reset overlay
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                }
            }
        } else {
            // If hamburger doesn't exist, set it up
            setupHamburgerMenu();
        }
    }, 300);
});

// Extra step: Make sure hamburger is visible when the page finishes loading
window.addEventListener('load', function() {
    if (window.innerWidth <= 576) {
        const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
        if (hamburgerBtn) {
            hamburgerBtn.style.display = 'flex';
            hamburgerBtn.style.zIndex = '9999';
        } else {
            // If button doesn't exist on load, create it
            setupHamburgerMenu();
        }
    }
    if (window.innerWidth <= 576) {
        forceShowHamburger();
        
        // Add an extra safety timeout to ensure it appears after all other code runs
        setTimeout(forceShowHamburger, 1500);
    }
});

/**
 * Special fix for problematic pages
 */
function handleProblematicPages() {
    // Get the current page filename
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    const pageName = filename === '' || filename === '/' ? 'index.html' : filename;
    
    // Check if we're on one of the problematic pages
    const problematicPages = ['index.html', 'ai-chat.html', 'reminders.html', 'insights.html'];
    
    if (problematicPages.includes(pageName) && window.innerWidth <= 576) {
        // Force hide any bottom navigation
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            // Force our desired styles
            sidebar.style.display = 'block';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.right = '0';
            sidebar.style.left = 'auto';
            sidebar.style.bottom = 'auto';
            sidebar.style.height = '100vh';
            sidebar.style.width = '250px';
            sidebar.style.transform = 'translateX(100%)';
            sidebar.style.zIndex = '99991';
            
            // Force the default mobile nav to be hidden
            const computedStyle = window.getComputedStyle(sidebar);
            if (computedStyle.bottom === '0px' || 
                computedStyle.height === '60px' ||
                (sidebar.style.bottom && sidebar.style.bottom !== 'auto')) {
                
                // Create a clone of the sidebar for our slide-out menu
                const originalNav = sidebar.innerHTML;
                
                // Hide the original bottom navigation
                sidebar.style.display = 'none';
                
                // Create our own sidebar element
                const customSidebar = document.createElement('nav');
                customSidebar.className = 'sidebar custom-mobile-sidebar mobile-hidden';
                customSidebar.innerHTML = originalNav;
                customSidebar.style.position = 'fixed';
                customSidebar.style.top = '0';
                customSidebar.style.right = '0';
                customSidebar.style.left = 'auto';
                customSidebar.style.height = '100vh';
                customSidebar.style.width = '250px';
                customSidebar.style.transform = 'translateX(100%)';
                customSidebar.style.transition = 'transform 0.3s ease-in-out';
                customSidebar.style.backgroundColor = 'var(--dark-color)';
                customSidebar.style.zIndex = '99991';
                customSidebar.style.display = 'block';
                customSidebar.style.overflowY = 'auto';
                
                // Add the custom sidebar to the body
                document.body.appendChild(customSidebar);
                
                // Update hamburger click event to target our custom sidebar
                const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
                const overlay = document.querySelector('.sidebar-overlay');
                
                if (hamburgerBtn && overlay) {
                    // Replace the click event
                    hamburgerBtn.removeEventListener('click', null);
                    hamburgerBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        if (customSidebar.classList.contains('mobile-hidden')) {
                            customSidebar.classList.remove('mobile-hidden');
                            customSidebar.classList.add('mobile-visible');
                            customSidebar.style.transform = 'translateX(0)';
                            overlay.style.opacity = '1';
                            overlay.style.visibility = 'visible';
                            hamburgerBtn.innerHTML = '<i class="fas fa-times"></i>';
                        } else {
                            customSidebar.classList.add('mobile-hidden');
                            customSidebar.classList.remove('mobile-visible');
                            customSidebar.style.transform = 'translateX(100%)';
                            overlay.style.opacity = '0';
                            overlay.style.visibility = 'hidden';
                            hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    });
                    
                    // Update overlay click event
                    overlay.removeEventListener('click', null);
                    overlay.addEventListener('click', function() {
                        customSidebar.classList.add('mobile-hidden');
                        customSidebar.classList.remove('mobile-visible');
                        customSidebar.style.transform = 'translateX(100%)';
                        overlay.style.opacity = '0';
                        overlay.style.visibility = 'hidden';
                        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    });
                    
                    // Update nav links click events
                    const navLinks = customSidebar.querySelectorAll('.nav-link');
                    navLinks.forEach(link => {
                        link.addEventListener('click', function() {
                            customSidebar.classList.add('mobile-hidden');
                            customSidebar.classList.remove('mobile-visible');
                            customSidebar.style.transform = 'translateX(100%)';
                            overlay.style.opacity = '0';
                            overlay.style.visibility = 'hidden';
                            hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        });
                    });
                }
            }
        }
    }
}

// Call our special fix for problematic pages
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(handleProblematicPages, 100);
});

// Also call it on window load to ensure everything is ready
window.addEventListener('load', function() {
    handleProblematicPages();
    setTimeout(handleProblematicPages, 500);
});
