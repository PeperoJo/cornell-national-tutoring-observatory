let eventCardTemplate = null;

async function loadEventCardTemplate() {
    if (eventCardTemplate) return eventCardTemplate;

    const response = await fetch('components/event-card.html');
    if (!response.ok) {
        throw new Error(`HTTP error loading event card template! status: ${response.status}`);
    }

    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    eventCardTemplate = wrapper.firstElementChild;
    return eventCardTemplate;
}

document.addEventListener('DOMContentLoaded', async function () {
    const root = document.getElementById('events-container');
    if (!root) return;

    // Hide legacy, manually coded sections so only dynamic sections show
    ['events-2023', 'events-2024', 'events-2025'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const section = el.closest('section');
            if (section) {
                section.style.display = 'none';
            }
        }
    });

    try {
        const response = await fetch('data/meetings.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const years = await response.json();
        const cardTemplate = await loadEventCardTemplate();

        // Sort years descending (e.g., 2025, 2024, 2023)
        years.sort((a, b) => b.year - a.year);

        years.forEach(yearBlock => {
            if (!Array.isArray(yearBlock.events) || yearBlock.events.length === 0) return;

            // Sort events ascending within the year (calendar order)
            const sortedEvents = [...yearBlock.events].sort(compareEventsByMonth);

            const yearSection = document.createElement('section');
            yearSection.className = 'pb-5';

            const wrapper = document.createElement('div');
            wrapper.className = 'd-flex flex-column gap-4';

            const headingWrapper = document.createElement('div');
            headingWrapper.className = 'd-flex flex-column gap-1';

            const heading = document.createElement('h3');
            heading.className = 'fw-semibold mb-0';
            heading.style.fontSize = '32px';
            heading.style.lineHeight = '48px';
            heading.style.color = '#222222';
            heading.textContent = yearBlock.year;

            headingWrapper.appendChild(heading);
            wrapper.appendChild(headingWrapper);

            const row = document.createElement('div');
            row.className = 'row g-3';

            sortedEvents.forEach(event => {
                const card = createEventCard(event, cardTemplate);
                row.appendChild(card);
            });

            wrapper.appendChild(row);
            yearSection.appendChild(wrapper);
            root.appendChild(yearSection);
        });

        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    } catch (error) {
        console.error('Error loading meetings data:', error);
    }
});

const MONTH_ORDER = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

function compareEventsByMonth(a, b) {
    const monthNameA = (a.month || '').split(' ')[0];
    const monthNameB = (b.month || '').split(' ')[0];

    const monthA = MONTH_ORDER[monthNameA] || 13;
    const monthB = MONTH_ORDER[monthNameB] || 13;

    if (monthA !== monthB) return monthA - monthB;
    return (a.title || '').localeCompare(b.title || '');
}

function createEventCard(event, template) {
    const card = template.cloneNode(true);

    const monthEl = card.querySelector('.event-month');
    const titleEl = card.querySelector('.event-title');
    const linkEl = card.querySelector('.event-link');

    if (monthEl) {
        monthEl.textContent = event.month || '';
    }

    if (titleEl) {
        titleEl.textContent = event.title || '';
    }

    if (linkEl) {
        if (event.slidesUrl) {
            linkEl.href = event.slidesUrl;
            linkEl.style.display = '';
        } else {
            // Hide link entirely if no URL is provided
            linkEl.style.display = 'none';
        }
    }

    return card;
}

