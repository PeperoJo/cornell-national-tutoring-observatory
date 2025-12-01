let memberTemplate = null;
let teamDataCache = {};

// Map category names to JSON file names
const categoryFileMap = {
    'core-team': 'core-team.json',
    'practitioner-advisory-board': 'practitioner-advisory-board.json',
    'national-advisory-board': 'national-advisory-board.json',
    'tutoring-providers': 'tutoring-providers.json'
};

async function loadMemberTemplate() {
    if (memberTemplate) return memberTemplate;

    const response = await fetch('/components/member.html');
    if (!response.ok) {
        throw new Error(`HTTP error loading member template! status: ${response.status}`);
    }

    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    memberTemplate = wrapper.firstElementChild;
    return memberTemplate;
}

async function loadTeamData(category) {
    // Return cached data if available
    if (teamDataCache[category]) {
        return teamDataCache[category];
    }

    // Get the filename for this category
    const filename = categoryFileMap[category];
    if (!filename) {
        throw new Error(`Unknown category: ${category}`);
    }

    // Use a path relative to the HTML file so it works both with file:// and http(s) origins
    const response = await fetch(`data/team-information/${filename}`);
    if (!response.ok) {
        throw new Error(`HTTP error loading team data for ${category}! status: ${response.status}`);
    }

    const data = await response.json();
    // Cache the data
    teamDataCache[category] = data;
    return data;
}

function createMemberCard(member, category) {
    const card = memberTemplate.cloneNode(true);

    // Set category for filtering
    card.setAttribute('data-category', category);

    // Update headshot image
    const imgEl = card.querySelector('.member-image');
    if (imgEl && member.img) {
        imgEl.src = member.img;
        imgEl.alt = `${member.name || 'Member'} headshot`;
    }

    // Update name
    const nameEl = card.querySelector('h3');
    if (nameEl) {
        nameEl.textContent = member.name || 'Member Name';

        // Update position - find the p tag that's a sibling of h3
        const positionEl = nameEl.nextElementSibling;
        if (positionEl && positionEl.tagName === 'P') {
            positionEl.textContent = member.position || 'Position Title';
        }
    }

    // Update description
    const descEl = card.querySelector('.member-description');
    if (descEl) {
        descEl.textContent = member.description || 'Member description goes here.';
    }

    // Update social links
    const socialContainer = card.querySelector('.member-social');
    if (socialContainer && member.social) {
        socialContainer.innerHTML = '';
        
        if (member.social.email) {
            const emailWrapper = document.createElement('div');
            emailWrapper.className = 'd-flex align-items-center gap-2';
            const emailLink = document.createElement('a');
            emailLink.href = `mailto:${member.social.email}`;
            emailLink.className = 'text-decoration-none';
            emailLink.style.color = 'var(--primary-red)';
            emailLink.innerHTML = '<i data-feather="mail" class="icon-24"></i>';
            const emailText = document.createElement('span');
            emailText.textContent = member.social.email;
            emailLink.appendChild(emailText);
            emailWrapper.appendChild(emailLink);
            socialContainer.appendChild(emailWrapper);
        }

        if (member.social.website) {
            const websiteWrapper = document.createElement('div');
            websiteWrapper.className = 'd-flex align-items-center gap-2';
            const websiteLink = document.createElement('a');
            websiteLink.href = member.social.website;
            websiteLink.target = '_blank';
            websiteLink.rel = 'noopener noreferrer';
            websiteLink.className = 'text-decoration-none';
            websiteLink.style.color = 'var(--primary-red)';
            websiteLink.innerHTML = '<i data-feather="globe" class="icon-24"></i>';
            const websiteText = document.createElement('span');
            websiteText.textContent = member.social.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
            websiteLink.appendChild(websiteText);
            websiteWrapper.appendChild(websiteLink);
            socialContainer.appendChild(websiteWrapper);
        }

        if (member.social.twitter) {
            const twitterWrapper = document.createElement('div');
            twitterWrapper.className = 'd-flex align-items-center gap-2';
            const twitterLink = document.createElement('a');
            twitterLink.href = member.social.twitter;
            twitterLink.target = '_blank';
            twitterLink.rel = 'noopener noreferrer';
            twitterLink.className = 'text-decoration-none';
            twitterLink.style.color = 'var(--primary-red)';
            twitterLink.innerHTML = '<i data-feather="twitter" class="icon-24"></i>';
            const twitterText = document.createElement('span');
            twitterText.textContent = member.social.twitter.replace(/^https?:\/\//, '').replace(/\/$/, '');
            twitterLink.appendChild(twitterText);
            twitterWrapper.appendChild(twitterLink);
            socialContainer.appendChild(twitterWrapper);
        }

        if (member.social.linkedin) {
            const linkedinWrapper = document.createElement('div');
            linkedinWrapper.className = 'd-flex align-items-center gap-2';
            const linkedinLink = document.createElement('a');
            linkedinLink.href = member.social.linkedin;
            linkedinLink.target = '_blank';
            linkedinLink.rel = 'noopener noreferrer';
            linkedinLink.className = 'text-decoration-none';
            linkedinLink.style.color = 'var(--primary-red)';
            linkedinLink.innerHTML = '<i data-feather="linkedin" class="icon-24"></i>';
            const linkedinText = document.createElement('span');
            linkedinText.textContent = member.social.linkedin.replace(/^https?:\/\//, '').replace(/\/$/, '');
            linkedinLink.appendChild(linkedinText);
            linkedinWrapper.appendChild(linkedinLink);
            socialContainer.appendChild(linkedinWrapper);
        }
    }

    return card;
}

async function renderTeamMembers(category) {
    const container = document.getElementById('team-members-container');
    if (!container) return;

    container.innerHTML = '';

    try {
        const members = await loadTeamData(category);
        
        if (!Array.isArray(members) || members.length === 0) {
            console.warn(`No members found for category: ${category}`);
            return;
        }

        members.forEach(member => {
            const card = createMemberCard(member, category);
            container.appendChild(card);
        });

        // Re-initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    } catch (error) {
        console.error(`Error rendering team members for ${category}:`, error);
    }
}

function initTeamTabs() {
    const tabs = document.querySelectorAll('.team-tab');
    const container = document.getElementById('team-members-container');

    if (!tabs.length || !container) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            // Remove active class and update button styles
            tabs.forEach(t => {
                t.classList.remove('active');
                t.classList.remove('btn-primary');
                t.classList.add('btn-outline-dark');
            });

            // Add active class to clicked tab
            this.classList.add('active');
            this.classList.remove('btn-outline-dark');
            this.classList.add('btn-primary');

            // Get category and render members
            const category = this.getAttribute('data-category');
            await renderTeamMembers(category);
        });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadMemberTemplate();
        
        // Render initial category (core-team)
        await renderTeamMembers('core-team');
        
        // Initialize tab switching
        initTeamTabs();
    } catch (error) {
        console.error('Error initializing team page:', error);
    }
});

