// Fetch travel data from JSON file
let travelData;

fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log('Data loaded:', travelData);
    })
    .catch(error => console.error('Error loading data:', error));

function searchDestinations() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!travelData) {
        console.error('Travel data not loaded yet');
        return;
    }

    // Filter destinations based on search keyword
    const filteredDestinations = travelData.filter(destination => {
        const searchTerm = searchInput.toLowerCase();
        return destination.type.toLowerCase().includes(searchTerm) ||
               destination.name.toLowerCase().includes(searchTerm) ||
               destination.country.toLowerCase().includes(searchTerm);
    });

    // Display results
    filteredDestinations.forEach(destination => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <img src="${destination.imageUrl}" alt="${destination.name}">
            <h3>${destination.name}</h3>
            <p>${destination.description}</p>
            <p>Location: ${destination.country}</p>
            ${destination.currentTime ? `<p>Local Time: ${getLocalTime(destination.timezone)}</p>` : ''}
        `;
        resultsContainer.appendChild(card);
    });
}

function clearResults() {
    document.getElementById('searchInput').value = '';
    document.getElementById('results').innerHTML = '';
}

function getLocalTime(timezone) {
    const options = { 
        timeZone: timezone, 
        hour12: true, 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric' 
    };
    return new Date().toLocaleTimeString('en-US', options);
}