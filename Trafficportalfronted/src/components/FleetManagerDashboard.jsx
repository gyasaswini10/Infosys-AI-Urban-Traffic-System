import React, { Component } from 'react';
import { BASEURL, callApi } from '../api';
import '../css/AdminDashboard.css';
import Header from './Header';
import MenuBar from './MenuBar';
import { MANAGER_MENU } from './MenuConstants';
import RouteOptimization from './RouteOptimization';
import Maintenance from './Maintenance';
import TrafficDashboard from './TrafficDashboard';
import AISmartZonesMap from './AISmartZonesMap';
import RoutePlanner from './RoutePlanner';
import Profile from './Profile';

export default class FleetManagerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeView: 'fleet_dashboard',
            vehicles: [],
            drivers: [],
            incidents: []
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        // Fetch Vehicles
        callApi("GET", BASEURL + "vehicle/all", null, (data) => {
            try { this.setState({ vehicles: JSON.parse(data) }); } catch(e) { this.setState({vehicles: []}); }
        });

        // Fetch Drivers
        callApi("GET", BASEURL + "users/role/3", null, (data) => {
             try { this.setState({ drivers: JSON.parse(data) }); } catch(e) { this.setState({drivers: []}); }
        });

        // Fetch Traffic Incidents
        callApi("GET", BASEURL + "traffic/read", null, (data) => {
            try { this.setState({ incidents: JSON.parse(data) }); } catch(e) { this.setState({incidents: []}); }
        });
    }

    handleMenuClick(menuId) {
        const selected = MANAGER_MENU.find(m => m.mid === menuId);
        if (selected) {
            this.setState({ activeView: selected.view });
        }
    }

    updateVehicleStatus(id, status) {
        callApi("POST", BASEURL + "vehicle/updateStatus", { vehicleId: id, status: status }, () => {
            alert("Vehicle Status Updated");
            this.fetchData();
        });
    }

    updateDriverStatus(email, status) {
        callApi("POST", BASEURL + "users/updateStatus", { email: email, status: status }, () => {
            alert("Driver Status Updated");
            this.fetchData();
        });
    }

    renderContent() {
        const { activeView, vehicles, drivers, incidents } = this.state;
        const { userid, role } = this.props;

        switch (activeView) {
            case 'fleet_dashboard':
                return (
                    <div className="tab-content">
                        <h3>Active Fleet Status</h3>
                        <p>{Array.isArray(vehicles) ? vehicles.filter(v => v.status === 1).length : 0} vehicles currently active.</p>
                        
                        <h4>Full Fleet Inventory & Approval</h4>
                         <table className="dashboard-table">
                            <thead>
                                <tr><th>ID</th><th>Reg No</th><th>Model</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {Array.isArray(vehicles) && vehicles.length === 0 && <tr><td colSpan="5">No vehicles in database</td></tr>}
                                {Array.isArray(vehicles) && vehicles.map(v => (
                                    <tr key={v.vehicleId}>
                                        <td>{v.vehicleId}</td><td>{v.regNo}</td><td>{v.model}</td>
                                        <td>
                                            <span className={`status-badge status-${v.status}`}>
                                                {v.status === 1 ? 'Active' : v.status === 3 ? 'Pending' : v.status === 4 ? 'Rejected' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btn-group">
                                                {v.status !== 1 && <button onClick={() => this.updateVehicleStatus(v.vehicleId, 1)} className="btn-approve">Approve</button>}
                                                {v.status !== 4 && <button onClick={() => this.updateVehicleStatus(v.vehicleId, 4)} className="btn-reject">Reject</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'ai_routes':
                return <RouteOptimization />;
            case 'route_planner':
                return <RoutePlanner />;
            case 'ai_smart_zones':
                return <AISmartZonesMap />;
            case 'drivers':
                return (
                    <div className="tab-content">
                        <h3>Driver Management</h3>
                         <table className="dashboard-table">
                            <thead>
                                <tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                            {Array.isArray(drivers) && drivers.map(d => (
                                <tr key={d.email}>
                                    <td>{d.fullname}</td>
                                    <td>{d.email}</td>
                                    <td><span className={`status-badge status-${d.status}`}>{d.status === 1 ? 'Active' : d.status === 2 ? 'Rejected' : 'Pending'}</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            {d.status !== 1 && <button onClick={() => this.updateDriverStatus(d.email, 1)} className="btn-approve">Approve</button>}
                                            {d.status !== 2 && <button onClick={() => this.updateDriverStatus(d.email, 2)} className="btn-reject">Reject</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'maintenance':
                return <Maintenance role={role} userid={userid} />;
            case 'traffic_view':
                return <TrafficDashboard />;
            case 'reports':
                return (
                    <div className="tab-content">
                        <h3>📋 Fleet Analytics Reports</h3>
                        <div className="stats-container">
                             <div className="stat-card" style={{borderLeft:'5px solid #10b981'}}>
                                 <h3>Total Fuel Savings (EV)</h3>
                                 <h1>$12,450</h1>
                                 <p>Vs Diesel Fleet</p>
                             </div>
                             <div className="stat-card" style={{borderLeft:'5px solid #3b82f6'}}>
                                 <h3>Average Trip Time</h3>
                                 <h1>42 mins</h1>
                                 <p>Improved by 8%</p>
                             </div>
                             <div className="stat-card" style={{borderLeft:'5px solid #ef4444'}}>
                                 <h3>Maintenance Costs</h3>
                                 <h1>$3,200</h1>
                                 <p>This Quarter</p>
                             </div>
                        </div>
                        
                        <div className="card-panel" style={{marginTop:'20px'}}>
                            <h4>Monthly Performance Breakdown</h4>
                            <table className="dashboard-table">
                                <thead>
                                    <tr><th>Metric</th><th>Target</th><th>Actual</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>On-Time Deliveries</td><td>98%</td><td>96.5%</td><td><span className="status-badge status-2">At Risk</span></td></tr>
                                    <tr><td>Vehicle Utilization</td><td>85%</td><td>92%</td><td><span className="status-badge status-1">Excellent</span></td></tr>
                                    <tr><td>Avg Privacy Score</td><td>95</td><td>98</td><td><span className="status-badge status-1">Good</span></td></tr>
                                    <tr><td>CO2 Emission</td><td>&lt; 500kg</td><td>450kg</td><td><span className="status-badge status-1">Good</span></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'profile':
                return <Profile />;
            default:
                return null;
        }
    }

    render() {
        const { userid } = this.props;
        return (
            <div className="dashboard-layout" style={{display:'flex', height:'100vh', overflow:'hidden'}}>
                <div className="sidebar-container" style={{width:'260px', flexShrink:0, borderRight:'1px solid #ddd'}}>
                    <MenuBar manualMenus={MANAGER_MENU} onMenuClick={this.handleMenuClick} />
                </div>
                <div className="main-content" style={{flexGrow:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
                    <Header title="Fleet Manager Command" user={userid} />
                    <div className="content-scrollable" style={{flexGrow:1, overflowY:'auto', padding:'25px', background:'#f8f9fa'}}>
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}
