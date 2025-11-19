// Load GitHub Organization Widget
async function loadGitHubWidget() {
    const widgetContent = document.getElementById('github-widget-content');
    if (!widgetContent) return;

    try {
        // Fetch organization data
        const orgResponse = await fetch('https://api.github.com/orgs/National-Tutoring-Observatory');
        if (!orgResponse.ok) throw new Error('Failed to fetch organization data');
        const orgData = await orgResponse.json();

        // Fetch repositories
        const reposResponse = await fetch('https://api.github.com/orgs/National-Tutoring-Observatory/repos?sort=updated&per_page=5');
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();

        // Build widget HTML
        const widgetHTML = `
            <div class="d-flex align-items-start gap-3 mb-4">
                <img src="${orgData.avatar_url}" alt="${orgData.name || 'NTO'}" class="rounded border" style="width: 72px; height: 72px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h3 class="fw-semibold mb-2" style="font-size: 24px;">${orgData.name || 'National Tutoring Observatory'}</h3>
                    <div class="d-flex flex-wrap gap-3">
                        <div class="d-flex align-items-center gap-1">
                            <i data-feather="users" class="icon-16 text-dark"></i>
                            <span class="small">${orgData.followers || 0} followers</span>
                        </div>
                        ${orgData.blog ? `
                        <div class="d-flex align-items-center gap-1">
                            <i data-feather="star" class="icon-16 text-dark"></i>
                            <a href="${orgData.blog}" class="small text-dark text-decoration-none" target="_blank" rel="noopener noreferrer">${orgData.blog}</a>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            ${orgData.description || orgData.bio ? `
            <p class="body-text mb-3">${orgData.description || orgData.bio}</p>
            ` : ''}
            <div class="row g-3 mb-4">
                <div class="col-6">
                    <div class="small text-uppercase text-muted">Public Repos</div>
                    <div class="fw-semibold">${orgData.public_repos ?? '-'}</div>
                </div>
                <div class="col-6">
                    <div class="small text-uppercase text-muted">Email</div>
                    <div class="fw-semibold text-truncate d-inline-block" style="max-width: 180px;">${orgData.email || '—'}</div>
                </div>
            </div>
            <div>
                <div class="small text-uppercase text-muted mb-2">Popular Repositories</div>
                <div class="row g-2">
                    ${reposData.slice(0, 6).map(repo => `
                        <div class="col-6">
                            <div class="card border p-3">
                                <a href="${repo.html_url}" class="text-primary fw-semibold small text-decoration-none" target="_blank" rel="noopener noreferrer">${repo.name}</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        widgetContent.innerHTML = widgetHTML;
        
        // Re-initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    } catch (error) {
        console.error('Error loading GitHub widget:', error);
        widgetContent.innerHTML = `
            <div class="text-center py-5">
                <p class="text-muted">Unable to load GitHub information.</p>
                <a href="https://github.com/National-Tutoring-Observatory" class="btn btn-outline-primary btn-sm mt-2" target="_blank" rel="noopener noreferrer">
                    Visit GitHub
                </a>
            </div>
        `;
    }
}

// Initialize GitHub widget when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadGitHubWidget();
});

