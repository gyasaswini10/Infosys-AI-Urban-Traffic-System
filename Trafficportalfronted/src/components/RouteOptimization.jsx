import React, { Component } from 'react';
import '../css/RouteOptimization.css';
import { BASEURL, callApi } from '../api';

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

    handleOptimize() {
        const { start, end } = this.state;
        if (!start || !end) {
            alert("Please enter Start and End locations");
            return;
        }

        this.setState({ loading: true });
        // Simulating logic because we are mocking the map interaction
        // In a real scenario, we would use geocoding. 
        // Here we just fetch the mock routes from backend which returns predefined data
        callApi("GET", `${BASEURL}route/optimize?start=${start}&end=${end}`, null, (res) => {
            const data = JSON.parse(res);
            // Simulate adding "coordinates" for SVG drawing since backend mocked simple JSON
            // We will inject randomized SVG paths for visualization
            const enhancedRoutes = data.routes.map((r, index) => ({
                ...r,
                // Mock SVG paths M startX startY Q controlX controlY endX endY
                // We generate slight variations
                path: this.generateMockPath(index) 
            }));
            
            this.setState({ 
                routes: enhancedRoutes, 
                selectedRoute: enhancedRoutes[0], // Auto-select fastest
                loading: false 
            });
        });
    }
    
    generateMockPath(index) {
        // Generating mock SVG paths to visualize 3 different routes on a static canvas
        // Start roughly at 100,100 (Top Left) -> End roughly at 600,400 (Bottom Right)
        const startX = 100, startY = 100;
        const endX = 600, endY = 400;
        
        switch(index) {
            case 0: // Fastest (Green) - Direct with slight curve
                return `M ${startX} ${startY} Q ${350} ${150} ${endX} ${endY}`;
            case 1: // Eco (Blue) - Looping path
                return `M ${startX} ${startY} Q ${150} ${350} ${300} ${300} T ${endX} ${endY}`;
            case 2: // Balanced (Orange) - Middle path
                return `M ${startX} ${startY} Q ${450} ${200} ${endX} ${endY}`;
            default:
                return `M ${startX} ${startY} L ${endX} ${endY}`;
        }
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
                                placeholder="e.g. Warehouse A" 
                                value={start}
                                onChange={(e) => this.setState({start: e.target.value})}
                            />
                        </div>
                        <div className="route-input-group">
                            <label>Destination</label>
                            <input 
                                type="text" 
                                placeholder="e.g. City Center Zone 4" 
                                value={end}
                                onChange={(e) => this.setState({end: e.target.value})}
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
                                    onClick={() => this.setState({selectedRoute: route})}
                                    style={{borderLeft: `5px solid ${route.color}`}}
                                >
                                    <div className="eta-header">
                                        <span className="eta-type" style={{color: route.color}}>{route.type}</span>
                                        <span className="traffic-badge">{route.trafficCondition} Traffic</span>
                                    </div>
                                    <div className="eta-time">{route.eta} <span style={{fontSize:'0.8rem', fontWeight:'normal'}}>({route.distance})</span></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Visualization */}
                    <div className="map-visualization">
                        <div className="map-canvas">
                            {/* SVG Layer */}
                            <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                                    </marker>
                                </defs>
                                
                                {/* Background Grid/Features (Abstract Map) */}
                                <rect x="50" y="50" width="700" height="500" fill="none" stroke="#cbd5e1" strokeWidth="2" rx="20"/>
                                <path d="M200 50 V550" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" />
                                <path d="M400 50 V550" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" />
                                <path d="M600 50 V550" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" />
                                <path d="M50 200 H750" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" />
                                <path d="M50 400 H750" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" />
                                
                                {/* Start Marker */}
                                <circle cx="100" cy="100" r="8" className="location-marker" />
                                <text x="100" y="80" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">START</text>
                                
                                {/* End Marker */}
                                <circle cx="600" cy="400" r="8" className="location-marker" fill="#16a34a"/>
                                <text x="600" y="430" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">DESTINATION</text>

                                {/* Routes */}
                                {routes.map((route, idx) => (
                                    <path 
                                        key={idx}
                                        d={route.path}
                                        stroke={route.color}
                                        strokeOpacity={selectedRoute === route ? 1 : 0.3}
                                        strokeWidth={selectedRoute === route ? 6 : 4}
                                        fill="none"
                                        className="route-path"
                                        onClick={() => this.setState({selectedRoute: route})}
                                    />
                                ))}

                            </svg>
                            
                            {/* Overlay Info (Interactive) */}
                            {selectedRoute && (
                                <div style={{
                                    position: 'absolute', 
                                    bottom: '20px', 
                                    right: '20px', 
                                    background: 'rgba(255,255,255,0.9)', 
                                    padding: '10px', 
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                    fontSize: '0.9rem'
                                }}>
                                    <strong>Selected: {selectedRoute.type}</strong><br/>
                                    ETA: {selectedRoute.eta}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
