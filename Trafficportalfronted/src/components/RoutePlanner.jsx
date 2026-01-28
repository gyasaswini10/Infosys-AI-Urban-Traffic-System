import React, { useState, useEffect, useMemo } from 'react';
import '../css/RoutePlanner.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER = [17.385, 78.4867];

const TRAFFIC_LEVELS = {
    LOW: { color: '#22c55e', weight: 6, opacity: 0.8, label: 'Low Traffic' },
    MODERATE: { color: '#f59e0b', weight: 6, opacity: 0.8, label: 'Moderate Traffic' },
    HIGH: { color: '#ef4444', weight: 6, opacity: 0.8, label: 'High Traffic' },
    SEVERE: { color: '#dc2626', weight: 8, opacity: 0.9, label: 'Severe Traffic' }
};

const VEHICLE_TYPES = [
    { id: 'car', name: 'Car', avgSpeed: 40, icon: '🚗' },
    { id: 'bike', name: 'Bike', avgSpeed: 60, icon: '🏍️' },
    { id: 'truck', name: 'Truck', avgSpeed: 30, icon: '🚚' },
    { id: 'bus', name: 'Bus', avgSpeed: 35, icon: '🚌' },
    { id: 'ev', name: 'EV Car', avgSpeed: 45, icon: '🚙' }
];

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

function generateTrafficData(source, destination, currentTime, vehicleType) {
    const distance = calculateDistance(source, destination);
    const baseTime = (distance / (vehicleType.avgSpeed || 40)) * 60; // minutes
    
    // Vehicle-specific route multipliers - smaller range to preserve vehicle differences
    const routeMultipliers = getVehicleRouteMultipliers(vehicleType);
    
    // Generate multiple route options based on vehicle type
    const routes = [
        {
            id: 'fastest',
            name: `Fastest Route (${vehicleType.name})`,
            description: 'Shortest time - May have high traffic',
            distance: distance,
            trafficLevel: generateTrafficLevel(currentTime, 'highway', vehicleType),
            waypoints: generateWaypoints(source, destination, 'highway'),
            estimatedTime: baseTime * routeMultipliers.fastest,
            tollCost: Math.floor(distance * (vehicleType.id === 'truck' || vehicleType.id === 'bus' ? 0.8 : 0.5)),
            fuelCost: Math.floor(distance * getFuelRate(vehicleType)),
            vehicleAdvantage: getVehicleAdvantage(vehicleType, 'fastest')
        },
        {
            id: 'balanced',
            name: `Balanced Route (${vehicleType.name})`,
            description: 'Optimal time & traffic balance',
            distance: distance * 1.15,
            trafficLevel: generateTrafficLevel(currentTime, 'city', vehicleType),
            waypoints: generateWaypoints(source, destination, 'city'),
            estimatedTime: baseTime * routeMultipliers.balanced,
            tollCost: Math.floor(distance * (vehicleType.id === 'truck' || vehicleType.id === 'bus' ? 0.4 : 0.2)),
            fuelCost: Math.floor(distance * getFuelRate(vehicleType) * 1.1),
            vehicleAdvantage: getVehicleAdvantage(vehicleType, 'balanced')
        },
        {
            id: 'efficient',
            name: `Fuel Efficient Route (${vehicleType.name})`,
            description: 'Lowest cost - Longer but economical',
            distance: distance * 1.3,
            trafficLevel: generateTrafficLevel(currentTime, 'scenic', vehicleType),
            waypoints: generateWaypoints(source, destination, 'scenic'),
            estimatedTime: baseTime * routeMultipliers.efficient,
            tollCost: 0,
            fuelCost: Math.floor(distance * getFuelRate(vehicleType) * 0.8),
            vehicleAdvantage: getVehicleAdvantage(vehicleType, 'efficient')
        }
    ];
    
    return routes;
}

function getVehicleRouteMultipliers(vehicleType) {
    // Different multipliers for each vehicle type to preserve speed differences
    const multipliers = {
        'bike': {
            'fastest': 0.85,    // Bikes benefit most from clear routes
            'balanced': 1.0,    // Normal city routes
            'efficient': 1.2    // Longer scenic routes
        },
        'car': {
            'fastest': 0.9,
            'balanced': 1.1,
            'efficient': 1.4
        },
        'truck': {
            'fastest': 0.95,   // Trucks less affected by route type
            'balanced': 1.05,
            'efficient': 1.3
        },
        'bus': {
            'fastest': 0.92,   // Buses benefit from dedicated lanes
            'balanced': 1.08,
            'efficient': 1.35
        },
        'ev': {
            'fastest': 0.88,   // EVs good acceleration helps
            'balanced': 1.05,
            'efficient': 1.25
        }
    };
    
    return multipliers[vehicleType.id] || multipliers['car'];
}

function getFuelRate(vehicleType) {
    const fuelRates = {
        'car': 0.8,
        'bike': 0.4,
        'truck': 1.5,
        'bus': 1.8,
        'ev': 0.3
    };
    return fuelRates[vehicleType.id] || 0.8;
}

function getVehicleAdvantage(vehicleType, routeType) {
    const advantages = {
        'bike': {
            'fastest': 'Can use narrow lanes & avoid traffic',
            'balanced': 'Flexible routing options',
            'efficient': 'Best fuel economy'
        },
        'car': {
            'fastest': 'Highway speed advantage',
            'balanced': 'Comfortable & versatile',
            'efficient': 'Moderate fuel consumption'
        },
        'truck': {
            'fastest': 'Highway lanes available',
            'balanced': 'Avoids city restrictions',
            'efficient': 'Optimal for heavy loads'
        },
        'bus': {
            'fastest': 'Dedicated bus lanes',
            'balanced': 'Passenger comfort priority',
            'efficient': 'Lower per-person cost'
        },
        'ev': {
            'fastest': 'Instant acceleration',
            'balanced': 'Regenerative braking',
            'efficient': 'Lowest energy cost'
        }
    };
    return advantages[vehicleType.id]?.[routeType] || 'Standard routing';
}

function calculateDistance(source, destination) {
    const R = 6371; // Earth's radius in km
    const dLat = (destination[0] - source[0]) * Math.PI / 180;
    const dLon = (destination[1] - source[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(source[0] * Math.PI / 180) * Math.cos(destination[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function generateTrafficLevel(currentTime, routeType, vehicleType) {
    const hour = currentTime.getHours();
    const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
    
    let baseProbability = 0.3;
    
    // Route type affects traffic
    if (routeType === 'highway') baseProbability = 0.4;
    if (routeType === 'city') baseProbability = 0.6;
    if (routeType === 'scenic') baseProbability = 0.2;
    
    // Vehicle type affects traffic perception
    if (vehicleType.id === 'bike') baseProbability -= 0.1; // Bikes can avoid some traffic
    if (vehicleType.id === 'truck' || vehicleType.id === 'bus') baseProbability += 0.1; // Heavy vehicles affected more
    if (vehicleType.id === 'ev') baseProbability -= 0.05; // EVs can use special lanes
    
    // Time-based adjustments
    if (hour >= 7 && hour <= 10) baseProbability += 0.3; // Morning rush
    if (hour >= 17 && hour <= 20) baseProbability += 0.35; // Evening rush
    if (hour >= 22 || hour <= 6) baseProbability -= 0.2; // Night
    
    if (isWeekend) baseProbability -= 0.1;
    
    const random = Math.random();
    if (random > baseProbability + 0.3) return 'LOW';
    if (random > baseProbability) return 'MODERATE';
    if (random > baseProbability - 0.2) return 'HIGH';
    return 'SEVERE';
}

function generateWaypoints(source, destination, routeType) {
    const waypoints = [source];
    const numWaypoints = routeType === 'scenic' ? 4 : routeType === 'city' ? 3 : 2;
    
    for (let i = 0; i < numWaypoints; i++) {
        const progress = (i + 1) / (numWaypoints + 1);
        const lat = source[0] + (destination[0] - source[0]) * progress;
        const lng = source[1] + (destination[1] - source[1]) * progress;
        
        // Add some variation for realistic routes
        const variation = routeType === 'scenic' ? 0.02 : 0.01;
        waypoints.push([
            lat + (Math.random() - 0.5) * variation,
            lng + (Math.random() - 0.5) * variation
        ]);
    }
    
    waypoints.push(destination);
    return waypoints;
}

function ChangeView({ center, zoom }) {
    const map = useMap();
    React.useEffect(() => {
        if (center && center.length === 2) map.setView(center, zoom ?? map.getZoom());
    }, [center?.[0], center?.[1], zoom, map]);
    return null;
}

export default function RoutePlanner() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[0]);
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [searching, setSearch] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [updatingRoutes, setUpdatingRoutes] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Regenerate routes when vehicle type changes
    useEffect(() => {
        if (sourceCoords && destinationCoords) {
            setUpdatingRoutes(true);
            console.log('Regenerating routes due to vehicle type change to:', selectedVehicle.name);
            
            // Small delay to show loading state
            setTimeout(() => {
                const generatedRoutes = generateTrafficData(sourceCoords, destinationCoords, currentTime, selectedVehicle);
                setRoutes(generatedRoutes);
                setSelectedRoute(generatedRoutes[0]); // Select fastest by default
                setUpdatingRoutes(false);
            }, 300);
        }
    }, [selectedVehicle, sourceCoords, destinationCoords, currentTime]);

    const handleSearch = async () => {
        if (!source.trim() || !destination.trim()) {
            setSearchError('Please enter both source and destination');
            return;
        }

        setSearch(true);
        setSearchError('');
        
        try {
            const [srcCoords, destCoords] = await Promise.all([
                geocode(source),
                geocode(destination)
            ]);

            if (srcCoords && destCoords) {
                setSourceCoords(srcCoords);
                setDestinationCoords(destCoords);
                
                const generatedRoutes = generateTrafficData(srcCoords, destCoords, currentTime, selectedVehicle);
                setRoutes(generatedRoutes);
                setSelectedRoute(generatedRoutes[0]); // Select fastest by default
            } else {
                setSearchError('Could not find one or both locations');
            }
        } catch (error) {
            setSearchError('Search failed. Please try again.');
        } finally {
            setSearch(false);
        }
    };

    const mapCenter = useMemo(() => {
        if (sourceCoords && destinationCoords) {
            return [
                (sourceCoords[0] + destinationCoords[0]) / 2,
                (sourceCoords[1] + destinationCoords[1]) / 2
            ];
        }
        return DEFAULT_CENTER;
    }, [sourceCoords, destinationCoords]);

    return (
        <div className="route-planner-page">
            <div className="route-planner-sidebar">
                <h2 className="route-planner-title">
                    <span className="route-icon">🗺️</span> Intelligent Route Planner
                </h2>
                <p className="route-planner-subtitle">
                    AI-powered route optimization with real-time traffic analysis
                </p>

                <div className="route-input-section">
                    <div className="input-group">
                        <label>Starting Point</label>
                        <input
                            type="text"
                            placeholder="Enter source location..."
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="route-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Destination</label>
                        <input
                            type="text"
                            placeholder="Enter destination..."
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="route-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Vehicle Type</label>
                        <div className="vehicle-selector">
                            {VEHICLE_TYPES.map(vehicle => (
                                <button
                                    key={vehicle.id}
                                    className={`vehicle-btn ${selectedVehicle.id === vehicle.id ? 'active' : ''}`}
                                    onClick={() => setSelectedVehicle(vehicle)}
                                    disabled={updatingRoutes}
                                >
                                    <span className="vehicle-icon">{vehicle.icon}</span>
                                    <span className="vehicle-name">{vehicle.name}</span>
                                    <span className="vehicle-speed">{vehicle.avgSpeed} km/h</span>
                                </button>
                            ))}
                        </div>
                        {selectedVehicle && (
                            <div className="selected-vehicle-info">
                                <span className="info-icon">ℹ️</span>
                                <span>Selected: {selectedVehicle.name} (Avg: {selectedVehicle.avgSpeed} km/h)</span>
                            </div>
                        )}
                    </div>

                    <button
                        className="search-routes-btn"
                        onClick={handleSearch}
                        disabled={searching}
                    >
                        {searching ? '🔄 Analyzing Routes...' : '🔍 Find Best Routes'}
                    </button>

                    {searchError && <p className="search-error">{searchError}</p>}
                </div>

                {routes.length > 0 && (
                    <div className="routes-section">
                        <h3>Available Routes ({routes.length})</h3>
                        
                        {updatingRoutes && (
                            <div className="updating-indicator">
                                <span className="updating-spinner"></span>
                                <span>Updating routes for {selectedVehicle.name}...</span>
                            </div>
                        )}
                        
                        {/* Time Comparison */}
                        <div className="time-comparison">
                            <h4>⏱️ Time Comparison by Vehicle Type</h4>
                            <div className="comparison-grid">
                                {VEHICLE_TYPES.map(vehicle => {
                                    const comparisonTime = ((routes[0].estimatedTime / vehicle.avgSpeed) * selectedVehicle.avgSpeed).toFixed(0);
                                    const isCurrentVehicle = vehicle.id === selectedVehicle.id;
                                    const isFaster = comparisonTime < routes[0].estimatedTime;
                                    return (
                                        <div 
                                            key={vehicle.id} 
                                            className={`comparison-item ${isCurrentVehicle ? 'current' : ''}`}
                                        >
                                            <span className="vehicle-icon">{vehicle.icon}</span>
                                            <span className="vehicle-name">{vehicle.name}</span>
                                            <span className={`time-diff ${isFaster ? 'faster' : 'slower'}`}>
                                                {comparisonTime} min
                                                {isCurrentVehicle && ' ✓'}
                                                {!isCurrentVehicle && isFaster && ` (-${Math.round(routes[0].estimatedTime - comparisonTime)}min)`}
                                                {!isCurrentVehicle && !isFaster && ` (+${Math.round(comparisonTime - routes[0].estimatedTime)}min)`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="routes-list">
                            {routes.map(route => (
                                <div
                                    key={route.id}
                                    className={`route-card ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedRoute(route)}
                                >
                                    <div className="route-header">
                                        <h4>{route.name}</h4>
                                        <span className={`traffic-badge ${route.trafficLevel.toLowerCase()}`}>
                                            {TRAFFIC_LEVELS[route.trafficLevel].label}
                                        </span>
                                    </div>
                                    <p className="route-description">{route.description}</p>
                                    <div className="route-stats">
                                        <div className="stat">
                                            <span className="stat-label">Distance:</span>
                                            <span className="stat-value">{route.distance.toFixed(1)} km</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Time:</span>
                                            <span className="stat-value">{Math.round(route.estimatedTime)} min</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Toll:</span>
                                            <span className="stat-value">₹{route.tollCost}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Fuel:</span>
                                            <span className="stat-value">₹{route.fuelCost}</span>
                                        </div>
                                    </div>
                                    <div className="vehicle-advantage">
                                        <span className="advantage-icon">💡</span>
                                        <span className="advantage-text">{route.vehicleAdvantage}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="route-tips">
                    <h4>💡 Route Tips</h4>
                    <ul>
                        <li>Green routes have low traffic - ideal for smooth travel</li>
                        <li>Yellow routes have moderate traffic - expect some delays</li>
                        <li>Red routes have high traffic - consider alternative timing</li>
                        <li>Dark red routes have severe traffic - avoid if possible</li>
                    </ul>
                </div>
            </div>

            <div className="route-map-container">
                <MapContainer
                    center={mapCenter}
                    zoom={12}
                    className="route-map"
                    scrollWheelZoom
                >
                    <ChangeView center={mapCenter} zoom={12} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    
                    {selectedRoute && (
                        <Polyline
                            positions={selectedRoute.waypoints}
                            pathOptions={TRAFFIC_LEVELS[selectedRoute.trafficLevel]}
                        />
                    )}
                    
                    {sourceCoords && (
                        <Marker position={sourceCoords}>
                            <Popup>
                                <strong>🚀 Start: {source}</strong>
                            </Popup>
                        </Marker>
                    )}
                    
                    {destinationCoords && (
                        <Marker position={destinationCoords}>
                            <Popup>
                                <strong>🎯 Destination: {destination}</strong>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {selectedRoute && (
                    <div className="route-summary">
                        <div className="summary-item">
                            <span className="summary-label">Total Distance:</span>
                            <span className="summary-value">{selectedRoute.distance.toFixed(1)} km</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Estimated Time:</span>
                            <span className="summary-value">{Math.round(selectedRoute.estimatedTime)} minutes</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Traffic Condition:</span>
                            <span className={`summary-value traffic-${selectedRoute.trafficLevel.toLowerCase()}`}>
                                {TRAFFIC_LEVELS[selectedRoute.trafficLevel].label}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Total Cost:</span>
                            <span className="summary-value">₹{selectedRoute.tollCost + selectedRoute.fuelCost}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
