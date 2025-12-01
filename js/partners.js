let partnerTemplate = null;
let partnersDataCache = null;

async function loadPartnerTemplate() {
    if (partnerTemplate) return partnerTemplate;

    const response = await fetch('/components/partner.html');
    if (!response.ok) {
        throw new Error(`HTTP error loading partner template! status: ${response.status}`);
    }

    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    partnerTemplate = wrapper.firstElementChild;
    return partnerTemplate;
}

async function loadPartnersData() {
    if (partnersDataCache) return partnersDataCache;

    const response = await fetch('data/partners.json');
    if (!response.ok) {
        throw new Error(`HTTP error loading partners data! status: ${response.status}`);
    }

    const data = await response.json();
    partnersDataCache = Array.isArray(data) ? data : [];
    return partnersDataCache;
}

function createPartnerCard(partner) {
    const card = partnerTemplate.cloneNode(true);

    const logoImg = card.querySelector('.partner-logo');
    if (logoImg && partner.img) {
        logoImg.src = partner.img;
        logoImg.alt = `${partner.name || 'Partner'} logo`;
    }

    const nameEl = card.querySelector('.partner-name');
    if (nameEl) {
        nameEl.textContent = partner.name || 'Partner Name';
    }

    const descEl = card.querySelector('.partner-description');
    if (descEl) {
        descEl.textContent = partner.description || '';
    }

    const linkEl = card.querySelector('a.btn');
    if (linkEl) {
        if (partner.website) {
            linkEl.href = partner.website;
        } else {
            linkEl.removeAttribute('href');
            linkEl.classList.add('disabled');
        }
    }

    return card;
}

async function renderPartners() {
    const container = document.getElementById('partners-grid');
    if (!container) return;

    container.innerHTML = '';

    try {
        const [template] = await Promise.all([loadPartnerTemplate()]);
        const partners = await loadPartnersData();

        partners.forEach(partner => {
            const card = createPartnerCard(partner);
            container.appendChild(card);
        });

        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    } catch (error) {
        console.error('Error rendering partners:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderPartners();
});


