import React, { Component } from 'react';
import '../css/AdminDashboard.css';
import Header from './Header';
import MenuBar from './MenuBar';
import TrafficDashboard from './TrafficDashboard';
import TrafficSearch from './TrafficSearch';
import TrafficPosting from './TrafficPosting';
import Maintenance from './Maintenance';
import RouteOptimization from './RouteOptimization';
import Profile from './Profile';
import { ADMIN_MENU, DRIVER_MENU } from './MenuConstants';
import { BASEURL, callApi } from '../api';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeView: props.role === 3 ? 'my_routes' : 'city_overview', // Default view based on role
            isDriver: props.role === 3
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(menuId) {
        const menuList = this.state.isDriver ? DRIVER_MENU : ADMIN_MENU;
        const selected = menuList.find(m => m.mid === menuId);
        if (selected) {
            this.setState({ activeView: selected.view });
        }
    }

    renderContent() {
        const { activeView, isDriver } = this.state;
        const { userid, role } = this.props;

        // --- ADMIN VIEWS ---
        if (!isDriver) {
            switch (activeView) {
                case 'city_overview':
                    return <TrafficDashboard />;
                case 'traffic_control':
                    return (
                        <div className="tab-content">
                            <h3>🚦 Traffic Control Center</h3>
                            <div className="control-grid" style={{display:'grid', gridTemplateQuestions:'1fr 1fr', gap:'20px'}}>
                                <div className="card-panel">
                                    <h4>Active Diversions</h4>
                                    <ul className="alert-list">
                                        <li className="alert-item">🚧 <strong>Road No 45</strong>: Closed due to VIP movement (Ends: 18:00)</li>
                                        <li className="alert-item">🚧 <strong>Hitech City Flyover</strong>: Maintenance Work (Ends: 06:00)</li>
                                    </ul>
                                    <button className="btn-add" style={{marginTop:'10px'}}>+ Create New Diversion</button>
                                </div>
                                <div className="card-panel">
                                    <h4>Signal Priority Override</h4>
                                    <div className="signal-control">
                                        <label>Jubilee Checkpost</label>
                                        <div className="signal-lights">
                                            <span className="light red active"></span>
                                            <span className="light yellow"></span>
                                            <span className="light green"></span>
                                        </div>
                                        <button className="btn-approve">Force Green (Emergency)</button>
                                    </div>
                                    <div className="signal-control" style={{marginTop:'10px'}}>
                                        <label>KBR Park Junction</label>
                                        <div className="signal-lights">
                                            <span className="light red"></span>
                                            <span className="light yellow"></span>
                                            <span className="light green active"></span>
                                        </div>
                                        <button className="btn-approve">Force Red (Block)</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'analytics':
                    return (
                        <div className="tab-content">
                            <h3>📊 Smart City Analytics</h3>
                            <TrafficDashboard showAnalyticsOnly={true} />
                            <div className="analytics-extra" style={{marginTop:'20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                                <div className="card-panel">
                                    <h4>Congestion Trends (Last 7 Days)</h4>
                                    {/* Mock Chart Placeholder */}
                                    <div style={{height:'200px', background:'#f8f9fa', display:'flex', alignItems:'center', justifyContent:'center', border:'1px dashed #ccc'}}>
                                        📈 [Line Chart: Peak Hours 09:00 & 18:00]
                                    </div>
                                </div>
                                <div className="card-panel">
                                    <h4>Emissions Analysis</h4>
                                    <div style={{height:'200px', background:'#f8f9fa', display:'flex', alignItems:'center', justifyContent:'center', border:'1px dashed #ccc'}}>
                                        📉 [Bar Chart: CO2 Reduced by 15% this week]
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'maintenance':
                    return <Maintenance role={role} userid={userid} />;
                case 'incident_search':
                    return <TrafficSearch />;
                case 'post_alert':
                    return <TrafficPosting />;
                case 'profile':
                    return <Profile />;
                default:
                    return <TrafficDashboard />;
            }
        } 
        
        // --- DRIVER VIEWS ---
        else {
            switch (activeView) {
                case 'my_routes':
                    return (
                        <div className="tab-content">
                            <h3>📍 My Assigned Routes</h3>
                            <div className="route-card-list">
                                <div className="route-card active-route">
                                    <div className="route-header">
                                        <span className="badge-priority high">High Priority</span>
                                        <span className="route-time">ETA: 45 mins</span>
                                    </div>
                                    <h4>Logistics Hub A &rarr; City Center Zone 4</h4>
                                    <p>Cargo: Medical Supplies</p>
                                    <div className="progress-bar"><div style={{width:'40%'}}></div></div>
                                    <button className="btn-primary" style={{width:'100%', marginTop:'10px'}}>Start Navigation</button>
                                </div>
                                <div className="route-card">
                                    <div className="route-header">
                                        <span className="badge-priority medium">Scheduled</span>
                                        <span className="route-time">Pick up: 14:00</span>
                                    </div>
                                    <h4>City Center &rarr; Warehouse B</h4>
                                    <p>Cargo: General Goods</p>
                                    <button className="btn-secondary" style={{width:'100%', marginTop:'10px'}}>View Details</button>
                                </div>
                            </div>
                        </div>
                    );
                case 'navigation':
                    return <RouteOptimization />; // Reusing route planner as Nav
                case 'report_issue':
                    return <TrafficPosting />;
                case 'vehicle_health':
                    return <Maintenance role={role} userid={userid} />; // Reusing Maintenance for health
                case 'incentives':
                     return (
                        <div className="tab-content">
                            <h3>🏆 Driver Incentives & Rewards</h3>
                            <div className="stats-container">
                                <div className="stat-card gold">
                                    <h3>Eco Score</h3>
                                    <h1>94/100</h1>
                                    <p>Excellent Driving!</p>
                                </div>
                                <div className="stat-card blue">
                                    <h3>Reward Points</h3>
                                    <h1>4,500</h1>
                                    <p>Redeemable</p>
                                </div>
                            </div>
                            <h4>Your Achievements</h4>
                            <div className="achievements-list">
                                <div className="achievement-item unlocked">
                                    <span className="icon">🌱</span>
                                    <div>
                                        <strong>Eco Warrior</strong>
                                        <p>Saved 50kg CO2 this month</p>
                                    </div>
                                </div>
                                <div className="achievement-item unlocked">
                                    <span className="icon">⏱️</span>
                                    <div>
                                        <strong>On Time</strong>
                                        <p>98% On-time arrivals</p>
                                    </div>
                                </div>
                                <div className="achievement-item">
                                    <span className="icon">🛡️</span>
                                    <div>
                                        <strong>Safety First</strong>
                                        <p>No harsh braking for 1000km</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'profile':
                    return <Profile />;
                default:
                    return <RouteOptimization />;
            }
        }
    }

    render() {
        const menuList = this.state.isDriver ? DRIVER_MENU : ADMIN_MENU;
        const { userid } = this.props;

        return (
            <div className="dashboard-layout" style={{display:'flex', height:'100vh', overflow:'hidden'}}>
                <div className="sidebar-container" style={{width:'260px', flexShrink:0, borderRight:'1px solid #ddd'}}>
                    <MenuBar manualMenus={menuList} onMenuClick={this.handleMenuClick} />
                </div>
                <div className="main-content" style={{flexGrow:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
                    <Header title={this.state.isDriver ? "Driver Dashboard" : "NeuroFleetX Admin"} user={userid} />
                    <div className="content-scrollable" style={{flexGrow:1, overflowY:'auto', padding:'25px', background:'#f8f9fa'}}>
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}
