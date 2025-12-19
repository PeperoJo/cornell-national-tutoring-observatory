// Component loader for navbar and footer
const PROJECT_ROOT = 'cornell-national-tutoring-observatory';

function getBasePath() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const idx = segments.indexOf(PROJECT_ROOT);
    if (idx !== -1) {
        // e.g. /cornell-national-tutoring-observatory/
        return '/' + segments.slice(0, idx + 1).join('/') + '/';
    }
    // Fallback: user/org GitHub Pages or custom domain at root
    return '/';
}

function resolveComponentPath(relativePath) {
    // Components live beside index.html under the project root
    const base = getBasePath();
    return base + relativePath;
}

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const container = document.getElementById(elementId);
        const basePath = getBasePath();
        
        if (!container) {
            console.error(`Container element ${elementId} not found`);
            return;
        }
        
        container.innerHTML = html;

        // Normalize image sources in components so they work from any page depth
        const imgs = container.querySelectorAll('img');
        imgs.forEach(img => {
            const src = img.getAttribute('src');
            if (!src || src.startsWith('http') || src.startsWith('data:')) return;
            const clean = src.replace(/^\//, ''); // remove leading slash if present
            img.setAttribute('src', basePath + clean);

            // Apply lazy loading to component images unless explicitly disabled
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });

        // Fix navbar links so they always point to project-root pages (not relative to subdirectories)
        if (elementId === 'navbar-container') {
            const links = container.querySelectorAll('a.nav-link, .dropdown-menu a.dropdown-item, .navbar-brand');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#')) return;
                const clean = href.replace(/^\//, '');
                link.setAttribute('href', basePath + clean);
            });
        }

        // Fix footer links similarly so they work from any subpage
        if (elementId === 'footer-container') {
            const links = container.querySelectorAll('a[href]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                // Skip external links, anchors, and mailto
                if (
                    !href ||
                    href.startsWith('http') ||
                    href.startsWith('#') ||
                    href.startsWith('mailto:')
                ) {
                    return;
                }
                const clean = href.replace(/^\//, '');
                link.setAttribute('href', basePath + clean);
            });
        }
        
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
        loadComponent('navbar-container', resolveComponentPath('components/navbar.html'));
    }
    
    if (footerContainer) {
        loadComponent('footer-container', resolveComponentPath('components/footer.html'));
    }
});
