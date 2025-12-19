let memberTemplate = null;
let providerTemplate = null;
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

    const response = await fetch('components/member.html');
    if (!response.ok) {
        throw new Error(`HTTP error loading member template! status: ${response.status}`);
    }

    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    memberTemplate = wrapper.firstElementChild;
    return memberTemplate;
}

async function loadProviderTemplate() {
    if (providerTemplate) return providerTemplate;

    const response = await fetch('components/provider.html');
    if (!response.ok) {
        throw new Error(`HTTP error loading provider template! status: ${response.status}`);
    }

    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    providerTemplate = wrapper.firstElementChild;
    return providerTemplate;
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
        const desc = (member.description || '').trim();
        if (desc) {
            descEl.textContent = desc;
            descEl.classList.remove('d-none');
        } else {
            descEl.textContent = '';
            descEl.classList.add('d-none');
        }
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

        if (member.social.cv) {
            const cvWrapper = document.createElement('div');
            cvWrapper.className = 'd-flex align-items-center gap-2';
            const cvLink = document.createElement('a');
            cvLink.href = member.social.cv;
            cvLink.target = '_blank';
            cvLink.rel = 'noopener noreferrer';
            cvLink.className = 'text-decoration-none';
            cvLink.style.color = 'var(--primary-red)';
            cvLink.innerHTML = '<i data-feather="file-text" class="icon-24"></i>';
            const cvText = document.createElement('span');
            cvText.textContent = 'CV';
            cvLink.appendChild(cvText);
            cvWrapper.appendChild(cvLink);
            socialContainer.appendChild(cvWrapper);
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

function createProviderCard(provider) {
    const card = providerTemplate.cloneNode(true);

    // Set category for filtering (if needed)
    card.setAttribute('data-category', 'tutoring-providers');

    // Update provider logo
    const logoEl = card.querySelector('.provider-logo');
    if (logoEl && provider.img) {
        logoEl.src = provider.img;
        logoEl.alt = `${provider.company || 'Provider'} logo`;
    }

    // Update company name
    const nameEl = card.querySelector('.provider-name');
    if (nameEl) {
        nameEl.textContent = provider.company || '';
    }

    // Update company website (shown to the right of the name)
    const websiteContainer = card.querySelector('.provider-website');
    if (websiteContainer) {
        websiteContainer.innerHTML = '';

        if (provider.website) {
            const websiteWrapper = document.createElement('div');
            websiteWrapper.className = 'd-flex align-items-center gap-2';

            const websiteLink = document.createElement('a');
            websiteLink.href = provider.website;
            websiteLink.target = '_blank';
            websiteLink.rel = 'noopener noreferrer';
            websiteLink.className = 'text-decoration-none';
            websiteLink.style.color = 'var(--primary-red)';
            // Match member social website icon sizing
            websiteLink.innerHTML = '<i data-feather="globe" class="icon-24"></i>';

            const websiteText = document.createElement('span');
            websiteText.textContent = provider.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
            websiteLink.appendChild(websiteText);

            websiteWrapper.appendChild(websiteLink);
            websiteContainer.appendChild(websiteWrapper);
        }
    }

    // Update contacts
    const contactsContainer = card.querySelector('.provider-contacts');
    if (contactsContainer && Array.isArray(provider.contacts)) {
        contactsContainer.innerHTML = '';

        provider.contacts.forEach(contact => {
            const contactRow = document.createElement('div');
            contactRow.className = 'provider-contact d-flex gap-3';

            // Optional contact image
            if (contact.img) {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'provider-contact-image-container';
                const imgEl = document.createElement('img');
                imgEl.src = contact.img;
                imgEl.alt = `${contact.name || 'Contact'} headshot`;
                imgEl.className = 'provider-contact-image';
                imgWrapper.appendChild(imgEl);
                contactRow.appendChild(imgWrapper);
            }

            const infoWrapper = document.createElement('div');
            infoWrapper.className = 'provider-contact-info d-flex flex-column gap-1';

            if (contact.name) {
                const contactNameEl = document.createElement('div');
                contactNameEl.className = 'provider-contact-name';
                contactNameEl.textContent = contact.name;
                infoWrapper.appendChild(contactNameEl);
            }

            if (contact.title) {
                const contactTitleEl = document.createElement('div');
                contactTitleEl.className = 'provider-contact-title';
                contactTitleEl.textContent = contact.title;
                infoWrapper.appendChild(contactTitleEl);
            }

            if (contact.homepage) {
                const homepageWrapper = document.createElement('div');
                homepageWrapper.className = 'd-flex align-items-center gap-2';

                const homepageLink = document.createElement('a');
                homepageLink.href = contact.homepage;
                homepageLink.target = '_blank';
                homepageLink.rel = 'noopener noreferrer';
                homepageLink.className = 'text-decoration-none';
                homepageLink.style.color = 'var(--primary-red)';
                homepageLink.innerHTML = '<i data-feather="globe" class="icon-20"></i>';

                const homepageText = document.createElement('span');
                homepageText.textContent = contact.homepage.replace(/^https?:\/\//, '').replace(/\/$/, '');
                homepageLink.appendChild(homepageText);
                homepageWrapper.appendChild(homepageLink);

                infoWrapper.appendChild(homepageWrapper);
            }

            const bio = (contact.bio || '').trim();
            if (bio) {
                const bioEl = document.createElement('p');
                bioEl.className = 'provider-contact-bio mb-0';
                bioEl.textContent = bio;
                infoWrapper.appendChild(bioEl);
            }

            contactRow.appendChild(infoWrapper);
            contactsContainer.appendChild(contactRow);
        });
    }

    return card;
}

async function renderTeamMembers(category) {
    const container = document.getElementById('team-members-container');
    if (!container) return;

    container.innerHTML = '';

    try {
        const data = await loadTeamData(category);

        if (!Array.isArray(data) || data.length === 0) {
            console.warn(`No entries found for category: ${category}`);
            return;
        }

        if (category === 'tutoring-providers') {
            await loadProviderTemplate();

            data.forEach(provider => {
                const card = createProviderCard(provider);
                container.appendChild(card);
            });
        } else {
            data.forEach(member => {
                const card = createMemberCard(member, category);
                container.appendChild(card);
            });
        }

        // Re-initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    } catch (error) {
        console.error(`Error rendering team members for ${category}:`, error);
    }
}

function setActiveTab(category) {
    const tabs = document.querySelectorAll('.team-tab');
    if (!tabs.length) return;

    tabs.forEach(t => {
        const tabCategory = t.getAttribute('data-category');
        if (tabCategory === category) {
            t.classList.add('active');
            t.classList.remove('btn-outline-dark');
            t.classList.add('btn-primary');
        } else {
            t.classList.remove('active');
            t.classList.remove('btn-primary');
            t.classList.add('btn-outline-dark');
        }
    });
}

function initTeamTabs() {
    const tabs = document.querySelectorAll('.team-tab');
    const container = document.getElementById('team-members-container');

    if (!tabs.length || !container) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            // Get category and render members
            const category = this.getAttribute('data-category');
            // Update active tab styling
            setActiveTab(category);
            // Update URL hash so links can deep-link to specific tab
            if (category) {
                window.location.hash = `#${category}`;
            }
            await renderTeamMembers(category);
        });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadMemberTemplate();

        // Determine initial category from URL hash, default to core-team
        const hash = window.location.hash ? window.location.hash.substring(1) : '';
        const defaultCategory = 'core-team';
        const initialCategory = categoryFileMap[hash] ? hash : defaultCategory;

        // Set initial active tab and render members for that category
        setActiveTab(initialCategory);
        await renderTeamMembers(initialCategory);

        // Initialize tab switching
        initTeamTabs();
    } catch (error) {
        console.error('Error initializing team page:', error);
    }
});

