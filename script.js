// Comprehensive timezone list with major cities
const timezones = [
    { name: 'New York', timezone: 'America/New_York', country: 'USA', isMajor: true },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA', isMajor: true },
    { name: 'Chicago', timezone: 'America/Chicago', country: 'USA', isMajor: true },
    { name: 'Denver', timezone: 'America/Denver', country: 'USA', isMajor: false },
    { name: 'Anchorage', timezone: 'America/Anchorage', country: 'USA', isMajor: false },
    { name: 'Honolulu', timezone: 'Pacific/Honolulu', country: 'USA', isMajor: false },
    { name: 'London', timezone: 'Europe/London', country: 'UK', isMajor: true },
    { name: 'Paris', timezone: 'Europe/Paris', country: 'France', isMajor: true },
    { name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany', isMajor: true },
    { name: 'Madrid', timezone: 'Europe/Madrid', country: 'Spain', isMajor: false },
    { name: 'Rome', timezone: 'Europe/Rome', country: 'Italy', isMajor: false },
    { name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia', isMajor: true },
    { name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE', isMajor: false },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Thailand', isMajor: false },
    { name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore', isMajor: true },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong', isMajor: true },
    { name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China', isMajor: true },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan', isMajor: true },
    { name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea', isMajor: true },
    { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia', isMajor: true },
    { name: 'Melbourne', timezone: 'Australia/Melbourne', country: 'Australia', isMajor: false },
    { name: 'Auckland', timezone: 'Pacific/Auckland', country: 'New Zealand', isMajor: false },
    { name: 'Toronto', timezone: 'America/Toronto', country: 'Canada', isMajor: true },
    { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico', isMajor: true },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil', isMajor: true },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', isMajor: true },
    { name: 'Cairo', timezone: 'Africa/Cairo', country: 'Egypt', isMajor: true },
    { name: 'Lagos', timezone: 'Africa/Lagos', country: 'Nigeria', isMajor: false },
    { name: 'Johannesburg', timezone: 'Africa/Johannesburg', country: 'South Africa', isMajor: true },
    { name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey', isMajor: false },
    { name: 'Delhi', timezone: 'Asia/Kolkata', country: 'India', isMajor: true },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Thailand', isMajor: false },
    { name: 'Manila', timezone: 'Asia/Manila', country: 'Philippines', isMajor: false },
    { name: 'Jakarta', timezone: 'Asia/Jakarta', country: 'Indonesia', isMajor: false },
    { name: 'Perth', timezone: 'Australia/Perth', country: 'Australia', isMajor: false },
    { name: 'Fiji', timezone: 'Pacific/Fiji', country: 'Fiji', isMajor: false },
    { name: 'Lisbon', timezone: 'Europe/Lisbon', country: 'Portugal', isMajor: false },
    { name: 'Amsterdam', timezone: 'Europe/Amsterdam', country: 'Netherlands', isMajor: false },
    { name: 'Vienna', timezone: 'Europe/Vienna', country: 'Austria', isMajor: false },
    { name: 'Stockholm', timezone: 'Europe/Stockholm', country: 'Sweden', isMajor: false },
];

let addedTimezones = [];
let favorites = JSON.parse(localStorage.getItem('favoriteTimezones')) || [];
let currentFilter = 'all';

const clocksGrid = document.getElementById('clocksGrid');
const timezoneSelect = document.getElementById('timezoneSelect');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

// Populate timezone select
function populateTimezoneSelect() {
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.timezone;
        option.textContent = `${tz.name} (${tz.country})`;
        option.dataset.name = tz.name;
        option.dataset.country = tz.country;
        option.dataset.isMajor = tz.isMajor;
        timezoneSelect.appendChild(option);
    });
}

// Add timezone on select
timezoneSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const tzData = {
            timezone: e.target.value,
            name: selectedOption.dataset.name,
            country: selectedOption.dataset.country,
            isMajor: selectedOption.dataset.isMajor === 'true'
        };
        
        // Check if already added
        if (!addedTimezones.find(tz => tz.timezone === tzData.timezone)) {
            addedTimezones.push(tzData);
            saveTimezones();
            renderClocks();
        }
        timezoneSelect.value = '';
    }
});

// Default timezones to display
function initializeDefaultTimezones() {
    const defaults = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];
    addedTimezones = timezones.filter(tz => defaults.includes(tz.timezone));
    saveTimezones();
}

// Save timezones to localStorage
function saveTimezones() {
    localStorage.setItem('timezones', JSON.stringify(addedTimezones));
}

// Load timezones from localStorage
function loadTimezones() {
    const saved = localStorage.getItem('timezones');
    if (saved) {
        addedTimezones = JSON.parse(saved);
    } else {
        initializeDefaultTimezones();
    }
}

// Toggle favorite
function toggleFavorite(timezone) {
    const index = favorites.indexOf(timezone);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(timezone);
    }
    localStorage.setItem('favoriteTimezones', JSON.stringify(favorites));
    renderClocks();
}

// Remove timezone
function removeTimezone(timezone) {
    addedTimezones = addedTimezones.filter(tz => tz.timezone !== timezone);
    saveTimezones();
    renderClocks();
}

// Get current time in timezone
function getTimeInTimezone(timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    return formatter.format(now);
}

// Get date in timezone
function getDateInTimezone(timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    return formatter.format(now);
}

// Get UTC offset
function getUTCOffset(timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const tzTime = parseInt(parts.find(p => p.type === 'hour').value) * 60 + 
                   parseInt(parts.find(p => p.type === 'minute').value);
    const utcTime = now.getUTCHours() * 60 + now.getUTCMinutes();
    const diff = tzTime - utcTime;
    const hours = Math.floor(Math.abs(diff) / 60);
    const mins = Math.abs(diff) % 60;
    const sign = diff >= 0 ? '+' : '-';
    return `UTC ${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Create clock card
function createClockCard(tzData) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.dataset.timezone = tzData.timezone;
    
    const isFavorited = favorites.includes(tzData.timezone);
    const timeStr = getTimeInTimezone(tzData.timezone);
    const dateStr = getDateInTimezone(tzData.timezone);
    const utcOffset = getUTCOffset(tzData.timezone);
    
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    
    card.innerHTML = `
        <div class="clock-header">
            <div class="clock-location">
                <span class="location-name">${tzData.name}</span>
                <span class="country-code">${tzData.country}</span>
            </div>
            <div class="clock-actions">
                <button class="star-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite('${tzData.timezone}')" title="Add to favorites">⭐</button>
                <button class="delete-btn" ondblclick="removeTimezone('${tzData.timezone}')" title="Double-click to remove">✕</button>
            </div>
        </div>
        
        <div class="analog-clock">
            <div class="hand hour-hand" style="transform: rotate(${hours * 30 + minutes * 0.5}deg);"></div>
            <div class="hand minute-hand" style="transform: rotate(${minutes * 6 + seconds * 0.1}deg);"></div>
            <div class="hand second-hand" style="transform: rotate(${seconds * 6}deg);"></div>
        </div>
        
        <div class="digital-display">
            <div class="time-display">${timeStr}</div>
            <div class="date-display">${dateStr}</div>
        </div>
        
        <div class="clock-info">
            <div class="info-item">
                <div class="info-label">UTC Offset</div>
                <div class="info-value">${utcOffset}</div>
            </div>
            <div class="info-item">
                <div class="info-label">AM/PM</div>
                <div class="info-value">${hours >= 12 ? 'PM' : 'AM'}</div>
            </div>
        </div>
    `;
    
    return card;
}

// Render clocks
function renderClocks() {
    clocksGrid.innerHTML = '';
    
    let toRender = addedTimezones;
    
    // Apply filter
    if (currentFilter === 'favorites') {
        toRender = toRender.filter(tz => favorites.includes(tz.timezone));
    } else if (currentFilter === 'major') {
        toRender = toRender.filter(tz => tz.isMajor);
    }
    
    // Apply search
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        toRender = toRender.filter(tz => 
            tz.name.toLowerCase().includes(searchTerm) || 
            tz.country.toLowerCase().includes(searchTerm)
        );
    }
    
    if (toRender.length === 0) {
        clocksGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <h2>😴 No timezones found</h2>
                <p>Add timezones from the dropdown above to get started!</p>
            </div>
        `;
        return;
    }
    
    toRender.forEach((tzData, index) => {
        const card = createClockCard(tzData);
        card.style.animationDelay = `${index * 0.1}s`;
        clocksGrid.appendChild(card);
    });
}

// Update clocks every second
setInterval(() => {
    const cards = document.querySelectorAll('.clock-card');
    cards.forEach(card => {
        const timezone = card.dataset.timezone;
        const tzData = addedTimezones.find(tz => tz.timezone === timezone);
        
        if (tzData) {
            const timeStr = getTimeInTimezone(timezone);
            const dateStr = getDateInTimezone(timezone);
            const utcOffset = getUTCOffset(timezone);
            const [hours, minutes, seconds] = timeStr.split(':').map(Number);
            
            // Update digital display
            card.querySelector('.time-display').textContent = timeStr;
            card.querySelector('.date-display').textContent = dateStr;
            card.querySelector('.info-value:last-of-type').textContent = utcOffset;
            
            // Update analog clock hands
            card.querySelector('.hour-hand').style.transform = `rotate(${hours * 30 + minutes * 0.5}deg)`;
            card.querySelector('.minute-hand').style.transform = `rotate(${minutes * 6 + seconds * 0.1}deg)`;
            card.querySelector('.second-hand').style.transform = `rotate(${seconds * 6}deg)`;
        }
    });
}, 1000);

// Search functionality
searchInput.addEventListener('input', () => {
    renderClocks();
});

// Filter functionality
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderClocks();
    });
});

// Initialize
populateTimezoneSelect();
loadTimezones();
renderClocks();