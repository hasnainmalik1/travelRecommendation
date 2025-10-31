// Fetch travel data from JSON file and provide search/clear functionality
let travelData = [];

fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        // support both { destinations: [...] } and top-level array
        travelData = data.destinations || data || [];
        console.log('Data loaded:', travelData);
    })
    .catch(error => console.error('Error loading data:', error));

function singularize(term) {
    term = term.trim().toLowerCase();
    // quick plural handling: beaches -> beach, temples -> temple, countries -> country
    if (term.endsWith('es')) return term.slice(0, -2);
    if (term.endsWith('s')) return term.slice(0, -1);
    return term;
}

function searchDestinations() {
    const raw = (document.getElementById('searchInput') || { value: '' }).value;
    const searchTerm = singularize(raw);
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!travelData || travelData.length === 0) {
        console.error('Travel data not loaded yet or empty');
        resultsContainer.innerHTML = '<p style="color:#a00">No data available.</p>';
        return;
    }

    if (!searchTerm) {
        resultsContainer.innerHTML = '<p>Please enter a keyword such as "beach", "temple" or a country name.</p>';
        return;
    }

    // Filter destinations. Match on type, name, country, or description.
    const filtered = travelData.filter(dest => {
        const type = (dest.type || '').toLowerCase();
        const name = (dest.name || '').toLowerCase();
        const country = (dest.country || '').toLowerCase();
        const desc = (dest.description || '').toLowerCase();

        return type.includes(searchTerm) ||
               name.includes(searchTerm) ||
               country.includes(searchTerm) ||
               desc.includes(searchTerm);
    });

    if (filtered.length === 0) {
        resultsContainer.innerHTML = `<p>No recommendations found for "${raw}".</p>`;
        return;
    }

    // Render result cards
    filtered.forEach(destination => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <img src="${destination.imageUrl}" alt="${destination.name}">
            <h3>${destination.name}</h3>
            <p>${destination.description}</p>
            <p><strong>Location:</strong> ${destination.country || '—'}</p>
            ${destination.timezone ? `<p><strong>Local Time:</strong> ${getLocalTime(destination.timezone)}</p>` : ''}
        `;
        resultsContainer.appendChild(card);
    });
}

function clearResults() {
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) resultsContainer.innerHTML = '';
}

function getLocalTime(timezone) {
    try {
        const options = { timeZone: timezone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date().toLocaleTimeString('en-US', options);
    } catch (e) {
        return '';
    }
}