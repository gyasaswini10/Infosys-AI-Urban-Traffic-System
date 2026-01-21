import React, { Component } from 'react';
import '../css/RouteOptimization.css';
import { BASEURL, callApi } from '../api';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when route changes
function ChangeView({ bounds }) {
    const map = useMap();
    if (bounds && bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
    return null;
}

export default class RouteOptimization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: '',
            end: '',
            routes: [],
            selectedRoute: null,
            loading: false
        };
        this.handleOptimize = this.handleOptimize.bind(this);
    }

    // Helper to decode Google Polyline
    decodePolyline(encoded) {
        if (!encoded) return [];
        var poly = [];
        var index = 0, len = encoded.length;
        var lat = 0, lng = 0;

        while (index < len) {
            var b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            var p = [lat / 1e5, lng / 1e5];
            poly.push(p);
        }
        return poly;
    }

    jitterPath(path, index) {
        // Leave the first route (Best) as is
        if (index === 0 || !path) return path;

        // Offset subsequent routes significantly to be visible as separate lines
        // 0.02 degrees is roughly 2km, creating a very distinct separation
        const offset = index === 1 ? 0.02 : -0.02;

        return path.map(pt => [pt[0] + offset, pt[1] + offset]);
    }

    handleOptimize() {
        const { start, end } = this.state;
        if (!start || !end) {
            alert("Please enter Start and End locations");
            return;
        }

        this.setState({ loading: true });

        callApi("GET", `${BASEURL}route/optimize?start=${start}&end=${end}`, null, (res) => {
            try {
                const data = JSON.parse(res);
                const enhancedRoutes = data.routes.map((r, index) => ({
                    ...r,
                    decodedPath: this.decodePolyline(r.encodedPath)
                }));

                this.setState({
                    routes: enhancedRoutes,
                    selectedRoute: enhancedRoutes[0],
                    loading: false
                });
            } catch (e) {
                console.error("Error parsing response", e);
                this.setState({ loading: false });
                alert("Failed to calculate routes. Please try again.");
            }
        });
    }

    render() {
        const { start, end, routes, selectedRoute, loading } = this.state;

        return (
            <div className="route-optimization">
                <h2>AI Route Optimizer</h2>
                <div className="route-container">

                    {/* Sidebar Input & Cards */}
                    <div className="route-sidebar">
                        <div className="route-input-group">
                            <label>Start Location</label>
                            <input
                                type="text"
                                placeholder="e.g. New York, NY"
                                value={start}
                                onChange={(e) => this.setState({ start: e.target.value })}
                            />
                        </div>
                        <div className="route-input-group">
                            <label>Destination</label>
                            <input
                                type="text"
                                placeholder="e.g. Boston, MA"
                                value={end}
                                onChange={(e) => this.setState({ end: e.target.value })}
                            />
                        </div>
                        <button className="btn-optimize" onClick={this.handleOptimize}>
                            {loading ? 'Calculating AI Routes...' : 'Optimize Route'}
                        </button>

                        {/* ETA Cards */}
                        <div className="route-cards-container">
                            {routes.map((route, idx) => (
                                <div
                                    key={idx}
                                    className={`eta-card ${selectedRoute === route ? 'selected' : ''}`}
                                    onClick={() => this.setState({ selectedRoute: route })}
                                    style={{ borderLeft: `5px solid ${route.color}` }}
                                >
                                    <div className="eta-header">
                                        <span className="eta-type" style={{ color: route.color }}>{route.type}</span>
                                        <span className="traffic-badge">{route.trafficCondition} Traffic</span>
                                    </div>
                                    <div className="eta-time">{route.eta} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>({route.distance})</span></div>
                                    {route.co2 && <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>🌱 CO2 Impact: {route.co2}</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Visualization */}
                    <div className="map-visualization">
                        <div className="map-canvas" style={{ height: '100%', width: '100%' }}>
                            <MapContainer
                                center={[37.7749, -122.4194]}
                                zoom={10}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />

                                {routes.map((route, idx) => {
                                    // Jitter path if it's not the selected one or just to show separation
                                    // For visuals, we offset indices 1 and 2 slightly if they are duplicates
                                    const isSelected = selectedRoute === route;
                                    const displayPath = this.jitterPath(route.decodedPath, idx);

                                    return (
                                        <Polyline
                                            key={idx}
                                            positions={displayPath}
                                            color={route.color}
                                            opacity={isSelected ? 1 : 0.6}
                                            weight={isSelected ? 7 : 5}
                                            eventHandlers={{ click: () => this.setState({ selectedRoute: route }) }}
                                        />
                                    );
                                })}

                                {selectedRoute && selectedRoute.decodedPath && selectedRoute.decodedPath.length > 0 && (
                                    <>
                                        {/* Center View on Selected Route */}
                                        <ChangeView bounds={selectedRoute.decodedPath} />

                                        {/* Markers for Start/End */}
                                        <Marker position={selectedRoute.decodedPath[0]}>
                                            <Popup>Start</Popup>
                                        </Marker>
                                        <Marker position={selectedRoute.decodedPath[selectedRoute.decodedPath.length - 1]}>
                                            <Popup>End</Popup>
                                        </Marker>
                                    </>
                                )}
                            </MapContainer>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
