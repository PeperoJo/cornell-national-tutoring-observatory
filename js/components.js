// Component loader for navbar and footer
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const container = document.getElementById(elementId);
        
        if (!container) {
            console.error(`Container element ${elementId} not found`);
            return;
        }
        
        container.innerHTML = html;
        
        // Re-initialize Feather icons after component loads
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Re-initialize any scripts that need to run after component load
        if (elementId === 'navbar-container') {
            initNavbar();
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        console.error('Make sure you are running a local web server (e.g., npm run server)');
        
        // Show a helpful message in the container
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = `<div style="padding: 20px; background: #ffebee; color: #c62828; border: 1px solid #c62828; border-radius: 4px;">
                <strong>Component Loading Error:</strong><br>
                Could not load ${componentPath}. Make sure you are running a local web server.<br>
                Run: <code>npm run server</code> or <code>npm start</code>
            </div>`;
        }
    }
}

function initNavbar() {
    // Bootstrap handles navbar toggle automatically, but we can add active state logic here
    // Set active state based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#navbarNav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const navbarContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');
    
    if (navbarContainer) {
        // Use a path relative to the current page so it works on GitHub Pages and local servers
        loadComponent('navbar-container', 'components/navbar.html');
    }
    
    if (footerContainer) {
        // Use a path relative to the current page so it works on GitHub Pages and local servers
        loadComponent('footer-container', 'components/footer.html');
    }
});
