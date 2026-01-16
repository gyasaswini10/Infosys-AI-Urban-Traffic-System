import React, { Component } from 'react';
import { BASEURL, callApi } from '../api';
import '../css/AdminDashboard.css';
import MenuBar from './MenuBar';
import { MANAGER_MENU } from './MenuConstants';
import RouteOptimization from './RouteOptimization';
import Maintenance from './Maintenance';
import TrafficDashboard from './TrafficDashboard';
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
        callApi("POST", BASEURL + "vehicle/updateStatus", JSON.stringify({ vehicleId: id, status: status }), () => {
            alert("Vehicle Status Updated");
            this.fetchData();
        });
    }

    updateDriverStatus(email, status) {
        callApi("POST", BASEURL + "users/updateStatus", JSON.stringify({ email: email, status: status }), () => {
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
                        
                        <h4>Vehicle Approval Queue</h4>
                         <table className="dashboard-table">
                            <thead>
                                <tr><th>ID</th><th>Reg No</th><th>Model</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {Array.isArray(vehicles) && vehicles.filter(v => v.status === 3).length === 0 && <tr><td colSpan="5">No pending vehicles</td></tr>}
                                {Array.isArray(vehicles) && vehicles.filter(v => v.status === 3).map(v => (
                                    <tr key={v.vehicleId}>
                                        <td>{v.vehicleId}</td><td>{v.regNo}</td><td>{v.model}</td>
                                        <td><span className="status-badge status-pending">Pending</span></td>
                                        <td>
                                            <div className="action-btn-group">
                                                <button onClick={() => this.updateVehicleStatus(v.vehicleId, 1)} className="btn-approve">Approve</button>
                                                <button onClick={() => this.updateVehicleStatus(v.vehicleId, 4)} className="btn-reject">Reject</button>
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
                    <div className="placeholder-view">
                        <h2>Fleet Analytics Reports</h2>
                        <div className="stats-container">
                             <div className="stat-card"><h3>Fuel Costs</h3><p>$4,200</p></div>
                             <div className="stat-card"><h3>Avg Delay</h3><p>12 mins</p></div>
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
        return (
            <div className="dashboard-container">
                <MenuBar manualMenus={MANAGER_MENU} onMenuClick={this.handleMenuClick} />
                <div className="dashboard-content">
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
