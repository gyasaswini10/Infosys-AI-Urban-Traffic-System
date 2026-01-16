import React, { Component } from 'react';
import '../css/AdminDashboard.css';
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
                        <div className="placeholder-view">
                            <h2>Traffic Control Center</h2>
                            <p>Manage diversions and signal priorities here.</p>
                            <div className="control-panel-mock">
                                <button className="btn-control">🚑 Priority for Emergency</button>
                                <button className="btn-control warning">🚧 Set Diversion Zone</button>
                            </div>
                        </div>
                    );
                case 'analytics':
                    return (
                        <div className="placeholder-view">
                            <h2>Smart City Analytics</h2>
                            <p>Heatmaps and AI Forecasts gathered here.</p>
                            {/* Re-using TrafficDashboard components or similar could be done here */}
                             <TrafficDashboard showAnalyticsOnly={true} /> 
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
                        <div className="placeholder-view">
                           <h2>My Routes</h2>
                           <p>No active routes assigned. Stay on standby.</p>
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
                        <div className="placeholder-view">
                           <h2>Driver Incentives</h2>
                           <p>Eco-Driving Score: <strong>92/100</strong></p>
                           <p>Reward Points: <strong>450</strong></p>
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

        return (
            <div className="dashboard-container">
                <MenuBar manualMenus={menuList} onMenuClick={this.handleMenuClick} />
                <div className="dashboard-content">
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
