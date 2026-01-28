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

function generateZones(center, timeSlot) {
    const slot = LEVELS_AND_TIPS[timeSlot] || LEVELS_AND_TIPS.morning;
    return ZONE_TEMPLATES.map((t, i) => {
        const { level, tip } = slot[i] || slot[0];
        return {
            id: t.id,
            center: [center[0] + t.offset[0], center[1] + t.offset[1]],
            name: t.name,
            level,
            radius: t.radius,
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

    const zones = useMemo(
        () => generateZones(zonesCenter, timeSlot),
        [zonesCenter, timeSlot]
    );
    const highCount = zones.filter((z) => z.level === 'high').length;
    const moderateCount = zones.filter((z) => z.level === 'moderate').length;
    const lowCount = zones.filter((z) => z.level === 'low').length;
    const bestTime =
        timeSlot === 'midday' || timeSlot === 'night'
            ? timeSlot === 'midday'
                ? '10 AM – 4 PM'
                : '8 PM – 7 AM'
            : 'Avoid peak windows';

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
