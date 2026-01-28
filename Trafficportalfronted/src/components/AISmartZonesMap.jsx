import React, { useState, useMemo, useCallback } from 'react';
import '../css/AISmartZonesMap.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER = [17.385, 78.4867];

const TIME_SLOTS = [
    { id: 'morning', label: 'Morning Peak', range: '7–10 AM', icon: '🌅' },
    { id: 'midday', label: 'Midday', range: '10 AM–4 PM', icon: '☀️' },
    { id: 'evening', label: 'Evening Peak', range: '4–8 PM', icon: '🌆' },
    { id: 'night', label: 'Night', range: '8 PM–7 AM', icon: '🌙' },
];

const ZONE_TEMPLATES = [
    { id: 1, offset: [0.03, 0.02], name: 'Central / Downtown', radius: 1200 },
    { id: 2, offset: [0.04, 0], name: 'North sector', radius: 1000 },
    { id: 3, offset: [0.035, -0.025], name: 'Northwest', radius: 900 },
    { id: 4, offset: [0.015, 0.03], name: 'East / Transit hub', radius: 1100 },
    { id: 5, offset: [-0.01, 0.02], name: 'South', radius: 800 },
    { id: 6, offset: [-0.02, -0.01], name: 'Southwest', radius: 950 },
    { id: 7, offset: [0.025, -0.01], name: 'Outer corridor', radius: 700 },
];

const LEVELS_AND_TIPS = {
    morning: [
        { level: 'high', tip: 'AI: Leave before 7:30 AM or expect delays. Use ring road or alternate route.' },
        { level: 'high', tip: 'AI: Peak until 9:30 AM. Public transit often reduces commute time here.' },
        { level: 'moderate', tip: 'AI: Moderate congestion. Best window 8–8:30 AM.' },
        { level: 'high', tip: 'AI: Rail + road peak. Prefer transit or leave by 7 AM.' },
        { level: 'moderate', tip: 'AI: School traffic until 9 AM. Clear by 9:30.' },
        { level: 'moderate', tip: 'AI: Steady flow. Avoid 8–9 AM for faster trip.' },
        { level: 'low', tip: 'AI: Low congestion. Good alternate route.' },
    ],
    midday: [
        { level: 'moderate', tip: 'AI: Lunch-hour bulge 12–2 PM. Otherwise smooth.' },
        { level: 'low', tip: 'AI: Low congestion. Best time for errands.' },
        { level: 'low', tip: 'AI: Clear. Ideal for deliveries.' },
        { level: 'moderate', tip: 'AI: Steady. Transit hub stays busy.' },
        { level: 'low', tip: 'AI: Low. Good for mall & hospital trips.' },
        { level: 'moderate', tip: 'AI: Consistent footfall. No major spikes.' },
        { level: 'low', tip: 'AI: Low. Recommended corridor.' },
    ],
    evening: [
        { level: 'high', tip: 'AI: Peak 5–7 PM. Carpool or leave after 7:30 PM.' },
        { level: 'high', tip: 'AI: Heavy outbound. Use ring road or alternate.' },
        { level: 'high', tip: 'AI: Avoid 5:30–7 PM. Delays up to 35 min.' },
        { level: 'high', tip: 'AI: Evening rush. Transit or late exit suggested.' },
        { level: 'moderate', tip: 'AI: Moderate. Peak 6–7 PM.' },
        { level: 'moderate', tip: 'AI: Steady. Slight build-up 6–7 PM.' },
        { level: 'moderate', tip: 'AI: Moderate. Better before 5 PM.' },
    ],
    night: [
        { level: 'low', tip: 'AI: Low congestion. Safe for night commutes.' },
        { level: 'low', tip: 'AI: Clear. Minimal traffic.' },
        { level: 'low', tip: 'AI: Low. Good for late trips.' },
        { level: 'low', tip: 'AI: Light. Transit only.' },
        { level: 'low', tip: 'AI: Low. Drive cautious in nightlife areas.' },
        { level: 'moderate', tip: 'AI: Some activity. Generally clear.' },
        { level: 'low', tip: 'AI: Low. Recommended.' },
    ],
};

const LEVEL_COLORS = {
    high: { stroke: '#dc2626' },
    moderate: { stroke: '#d97706' },
    low: { stroke: '#16a34a' },
};

function generateDynamicCongestionLevel(location, timeSlot, zoneName, currentHour = null) {
    const hour = currentHour || new Date().getHours();
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    
    console.log(`Processing location: "${location}" for zone: "${zoneName}"`); // Debug log
    
    // Location-based factors from searched location
    const locationLower = location.toLowerCase();
    const isMetroCity = locationLower.includes('mumbai') || locationLower.includes('delhi') || 
                        locationLower.includes('bangalore') || locationLower.includes('hyderabad') ||
                        locationLower.includes('chennai') || locationLower.includes('kolkata') ||
                        locationLower.includes('pune') || locationLower.includes('ahmedabad');
    
    const isTier2City = locationLower.includes('lucknow') || locationLower.includes('jaipur') ||
                       locationLower.includes('chandigarh') || locationLower.includes('indore') ||
                       locationLower.includes('coimbatore') || locationLower.includes('kochi');
    
    console.log(`Location analysis - isMetroCity: ${isMetroCity}, isTier2City: ${isTier2City}`); // Debug log
    
    // Zone type detection
    const isDowntown = zoneName.toLowerCase().includes('central') || zoneName.toLowerCase().includes('downtown');
    const isTransitHub = zoneName.toLowerCase().includes('transit') || zoneName.toLowerCase().includes('hub');
    const isCommercial = zoneName.toLowerCase().includes('mall') || zoneName.toLowerCase().includes('market');
    const isResidential = zoneName.toLowerCase().includes('residential') || zoneName.toLowerCase().includes('south');
    
    // Base congestion probability based on city type
    let congestionProbability = isMetroCity ? 0.5 : isTier2City ? 0.35 : 0.25;
    
    console.log(`Base congestion probability: ${congestionProbability}`); // Debug log
    
    // Adjust for time slot
    switch (timeSlot) {
        case 'morning':
            congestionProbability += isWeekend ? 0.1 : 0.3;
            if (hour >= 7 && hour <= 9) congestionProbability += 0.2;
            break;
        case 'midday':
            congestionProbability += 0.15;
            if (hour >= 12 && hour <= 14) congestionProbability += 0.1;
            break;
        case 'evening':
            congestionProbability += isWeekend ? 0.2 : 0.35;
            if (hour >= 17 && hour <= 19) congestionProbability += 0.2;
            break;
        case 'night':
            congestionProbability -= 0.1;
            if (hour >= 22 || hour <= 6) congestionProbability -= 0.1;
            break;
    }
    
    // Adjust for location type
    if (isDowntown) congestionProbability += isMetroCity ? 0.25 : 0.15;
    if (isTransitHub) congestionProbability += isMetroCity ? 0.2 : 0.1;
    if (isCommercial && timeSlot === 'midday') congestionProbability += 0.15;
    if (isResidential && (timeSlot === 'morning' || timeSlot === 'evening')) congestionProbability += 0.1;
    
    // Add location-specific modifiers
    if (locationLower.includes('mumbai')) {
        congestionProbability += 0.1; // Mumbai typically has higher traffic
        console.log('Mumbai detected, adding 0.1 to congestion'); // Debug log
    } else if (locationLower.includes('bangalore')) {
        congestionProbability += 0.05; // Bangalore has moderate traffic
        console.log('Bangalore detected, adding 0.05 to congestion'); // Debug log
    } else if (locationLower.includes('hyderabad')) {
        congestionProbability += 0.08; // Hyderabad traffic patterns
        console.log('Hyderabad detected, adding 0.08 to congestion'); // Debug log
    }
    
    // Add randomness for realism but ensure location changes create different patterns
    const locationSeed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomFactor = Math.sin(locationSeed + zoneName.length + hour) * 0.1;
    congestionProbability += randomFactor;
    
    congestionProbability = Math.max(0.1, Math.min(0.9, congestionProbability));
    
    console.log(`Final congestion probability for ${zoneName}: ${congestionProbability}`); // Debug log
    
    // Determine level based on probability
    if (congestionProbability > 0.65) return 'high';
    if (congestionProbability > 0.35) return 'moderate';
    return 'low';
}

function generateDynamicTip(location, timeSlot, zoneName, level) {
    const locationLower = location.toLowerCase();
    const isMetroCity = locationLower.includes('mumbai') || locationLower.includes('delhi') || 
                        locationLower.includes('bangalore') || locationLower.includes('hyderabad');
    
    const isDowntown = zoneName.toLowerCase().includes('central') || zoneName.toLowerCase().includes('downtown');
    const isTransitHub = zoneName.toLowerCase().includes('transit') || zoneName.toLowerCase().includes('hub');
    const currentHour = new Date().getHours();
    
    // Location-specific tip templates
    const citySpecificTips = {
        mumbai: {
            high: [
                `AI: ${zoneName} - Mumbai's notorious traffic. Use local trains if possible.`,
                `AI: ${zoneName} - Expect 30-45 min delays. Consider Western/Eastern Express Highway.`,
                `AI: ${zoneName} - Peak Mumbai traffic. BEST buses or metro recommended.`
            ],
            moderate: [
                `AI: ${zoneName} - Moderate Mumbai traffic. Allow extra 15-20 minutes.`,
                `AI: ${zoneName} - Typical Mumbai flow. Use flyovers to save time.`
            ],
            low: [
                `AI: ${zoneName} - Clear for Mumbai standards. Quick transit expected.`,
                `AI: ${zoneName} - Unusually light Mumbai traffic. Optimal conditions.`
            ]
        },
        delhi: {
            high: [
                `AI: ${zoneName} - Delhi peak traffic. Use Delhi Metro or Ring Road.`,
                `AI: ${zoneName} - Heavy congestion. Avoid ITO and AIIMS area if possible.`,
                `AI: ${zoneName} - Delhi rush hour. Consider Gurgaon/Noida Expressway.`
            ],
            moderate: [
                `AI: ${zoneName} - Moderate Delhi traffic. Use BRT corridors where available.`,
                `AI: ${zoneName} - Typical Delhi conditions. Plan for 15 min delays.`
            ],
            low: [
                `AI: ${zoneName} - Light Delhi traffic. Good time for Connaught Place.`,
                `AI: ${zoneName} - Clear roads. Optimal for Delhi travel.`
            ]
        },
        default: {
            high: [
                `AI: ${zoneName} experiencing heavy traffic. Delay of 20-35 minutes likely.`,
                `AI: Avoid ${zoneName} if possible. Use ring roads or bypass routes.`,
                `AI: Peak traffic in ${zoneName}. Carpooling or transit recommended.`,
                `AI: Severe congestion in ${zoneName}. Consider alternate routes.`
            ],
            moderate: [
                `AI: Moderate traffic in ${zoneName}. Allow extra 10-15 minutes.`,
                `AI: ${zoneName} has steady flow. Minor delays possible.`,
                `AI: Light congestion in ${zoneName}. Traffic moving well.`,
                `AI: Normal conditions in ${zoneName}. No major issues.`
            ],
            low: [
                `AI: Clear roads in ${zoneName}. Optimal travel conditions.`,
                `AI: Light traffic in ${zoneName}. Quick transit expected.`,
                `AI: ${zoneName} is congestion-free. Best time to travel.`,
                `AI: Smooth flow in ${zoneName}. No delays anticipated.`
            ]
        }
    };
    
    // Get city-specific tips or default
    let tipSet = citySpecificTips.default;
    for (const [city, tips] of Object.entries(citySpecificTips)) {
        if (locationLower.includes(city)) {
            tipSet = tips;
            break;
        }
    }
    
    const levelTips = tipSet[level] || tipSet.low;
    return levelTips[Math.floor(Math.random() * levelTips.length)];
}

function generateZones(center, timeSlot, location = '') {
    console.log('Generating zones for location:', location, 'timeSlot:', timeSlot); // Debug log
    
    return ZONE_TEMPLATES.map((t) => {
        const level = generateDynamicCongestionLevel(location, timeSlot, t.name);
        const tip = generateDynamicTip(location, timeSlot, t.name, level);
        
        console.log(`Zone ${t.name}: level=${level}, location=${location}`); // Debug log
        
        // Dynamic radius based on congestion level
        let radius = t.radius;
        if (level === 'high') radius *= 1.2;
        if (level === 'low') radius *= 0.8;
        
        return {
            id: t.id,
            center: [center[0] + t.offset[0], center[1] + t.offset[1]],
            name: t.name,
            level,
            radius,
            tip,
        };
    });
}

function ChangeView({ center, zoom }) {
    const map = useMap();
    React.useEffect(() => {
        if (center && center.length === 2) map.setView(center, zoom ?? map.getZoom());
    }, [center?.[0], center?.[1], zoom, map]);
    return null;
}

const GEOCODE_URL = 'https://photon.komoot.io/api/';

async function geocode(query) {
    const q = query.trim();
    if (!q) return null;
    const res = await fetch(
        `${GEOCODE_URL}?q=${encodeURIComponent(q)}&limit=1`,
        { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    const f = data?.features?.[0];
    if (!f?.geometry?.coordinates) return null;
    const [lon, lat] = f.geometry.coordinates;
    return [lat, lon];
}

export default function AISmartZonesMap() {
    const [timeSlot, setTimeSlot] = useState('morning');
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [zonesCenter, setZonesCenter] = useState(DEFAULT_CENTER);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [currentLocation, setCurrentLocation] = useState('Hyderabad'); // Initialize with default location
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [zones, setZones] = useState([]); // Direct state instead of useMemo

    // Update zones every 30 seconds for real-time feel
    React.useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Generate zones whenever location, timeSlot, or lastUpdate changes
    React.useEffect(() => {
        console.log('Regenerating zones due to location/time/update change');
        console.log('Current params:', { zonesCenter, timeSlot, currentLocation });
        const newZones = generateZones(zonesCenter, timeSlot, currentLocation);
        setZones(newZones);
    }, [zonesCenter, timeSlot, currentLocation, lastUpdate]);

    // Initialize zones on mount
    React.useEffect(() => {
        console.log('Initializing zones on mount');
        const initialZones = generateZones(zonesCenter, timeSlot, currentLocation);
        setZones(initialZones);
    }, []); // Only run once on mount

    const highCount = zones.filter((z) => z.level === 'high').length;
    const moderateCount = zones.filter((z) => z.level === 'moderate').length;
    const lowCount = zones.filter((z) => z.level === 'low').length;
    
    // Dynamic best time recommendation based on current conditions
    const getBestTimeRecommendation = () => {
        const currentHour = new Date().getHours();
        const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
        
        if (highCount > moderateCount + lowCount) {
            return 'Avoid peak hours - try midday or night';
        } else if (lowCount > highCount + moderateCount) {
            return 'Current conditions optimal for travel';
        } else if (currentHour >= 7 && currentHour <= 9) {
            return 'Wait until after 9:30 AM for better flow';
        } else if (currentHour >= 17 && currentHour <= 19) {
            return 'Travel after 7:30 PM or before 4:30 PM';
        } else {
            return 'Current time is good for travel';
        }
    };
    
    const bestTime = getBestTimeRecommendation();

    const handleSearch = useCallback(async () => {
        const q = searchQuery.trim();
        if (!q) {
            setSearchError('Enter a city or address');
            return;
        }
        setSearching(true);
        setSearchError('');
        try {
            const coords = await geocode(q);
            if (coords) {
                setMapCenter(coords);
                setZonesCenter(coords);
                setCurrentLocation(q); // Set location for dynamic generation
                setLastUpdate(new Date()); // Force immediate update
                console.log('Location changed to:', q); // Debug log
            } else {
                setSearchError('Location not found. Try another search.');
            }
        } catch (e) {
            setSearchError('Search failed. Check connection or try again.');
        } finally {
            setSearching(false);
        }
    }, [searchQuery]);

    return (
        <div className="ai-zones-page">
            <div className="ai-zones-sidebar">
                <h2 className="ai-zones-title">
                    <span className="ai-zones-icon">🧠</span> AI Smart Zones
                </h2>
                <p className="ai-zones-subtitle">
                    AI‑predicted congestion for <strong>any location</strong>. Search a city or address, pick a time, then click zones for AI tips.
                </p>

                <div className="location-search">
                    <label>Search location</label>
                    <div className="location-search-row">
                        <input
                            type="text"
                            placeholder="e.g. Mumbai, Bangalore, London, Delhi"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            type="button"
                            className="btn-search-location"
                            onClick={handleSearch}
                            disabled={searching}
                        >
                            {searching ? 'Searching…' : 'Go'}
                        </button>
                    </div>
                    {searchError && <p className="search-error">{searchError}</p>}
                </div>

                <div className="time-slot-picker">
                    <label>Time of day</label>
                    <div className="time-slot-grid">
                        {TIME_SLOTS.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                className={`time-slot-btn ${timeSlot === s.id ? 'active' : ''}`}
                                onClick={() => setTimeSlot(s.id)}
                            >
                                <span className="slot-icon">{s.icon}</span>
                                <span className="slot-label">{s.label}</span>
                                <span className="slot-range">{s.range}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ai-summary-card">
                    <h4>AI Summary</h4>
                    <div className="real-time-indicator">
                        <span className="live-dot"></span>
                        <span className="update-text">Live • Updated {lastUpdate.toLocaleTimeString()}</span>
                    </div>
                    <div className="summary-stats">
                        <div className="summary-row high">
                            <span className="dot" />
                            <span>High</span>
                            <strong>{highCount}</strong>
                        </div>
                        <div className="summary-row moderate">
                            <span className="dot" />
                            <span>Moderate</span>
                            <strong>{moderateCount}</strong>
                        </div>
                        <div className="summary-row low">
                            <span className="dot" />
                            <span>Low</span>
                            <strong>{lowCount}</strong>
                        </div>
                    </div>
                    <p className="best-time">
                        <strong>Best time to travel:</strong> {bestTime}
                    </p>
                </div>

                <div className="zone-legend">
                    <h4>Zone legend</h4>
                    <div className="legend-items">
                        <div className="legend-item">
                            <span className="legend-color high" />
                            <span>High congestion</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color moderate" />
                            <span>Moderate</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color low" />
                            <span>Low / Clear</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ai-zones-map-wrap">
                <MapContainer
                    center={mapCenter}
                    zoom={12}
                    className="ai-zones-map"
                    scrollWheelZoom
                >
                    <ChangeView center={mapCenter} zoom={12} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {zones.map((z) => {
                        const style = LEVEL_COLORS[z.level] || LEVEL_COLORS.low;
                        return (
                            <Circle
                                key={z.id}
                                center={z.center}
                                radius={z.radius}
                                pathOptions={{
                                    fillColor: style.stroke,
                                    color: style.stroke,
                                    fillOpacity: 0.35,
                                    weight: 2,
                                }}
                            >
                                <Popup>
                                    <div className="zone-popup">
                                        <strong>{z.name}</strong>
                                        <span className={`popup-badge ${z.level}`}>{z.level}</span>
                                        <p className="popup-tip">{z.tip}</p>
                                    </div>
                                </Popup>
                            </Circle>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
