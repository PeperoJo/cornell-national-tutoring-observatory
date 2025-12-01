document.addEventListener('DOMContentLoaded', function () {
    const spinner = document.getElementById('supascribe-loading');
    const feedContainer = document.querySelector('[data-supascribe-feed]');

    if (!spinner || !feedContainer) return;

    let attempts = 0;
    const maxAttempts = 40; // ~20 seconds at 500ms per check

    function checkLoaded() {
        attempts += 1;

        // Supascribe injects content into the feed container when ready
        if (feedContainer.children.length > 0) {
            spinner.style.display = 'none';
            return;
        }

        if (attempts < maxAttempts) {
            setTimeout(checkLoaded, 500);
        } else {
            // Timeout: keep a subtle message instead of spinner
            spinner.innerHTML = '<p class="text-muted mb-0">Content is taking longer to load. You may need to refresh the page.</p>';
        }
    }

    checkLoaded();
});


