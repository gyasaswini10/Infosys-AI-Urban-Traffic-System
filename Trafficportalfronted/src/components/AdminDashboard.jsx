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
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeView: props.role === 3 ? 'my_routes' : 'city_overview', // Default view based on role
            isDriver: props.role === 3,
            driverStats: null,
            users: [],
            diversions: [],
            analyticsData: null
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    componentDidMount() {
        if (this.state.isDriver && this.props.userid) {
            this.fetchDriverStats();
        } else {
            this.fetchUsers();
            this.fetchDiversions();
            this.fetchAnalytics();
        }
    }

    fetchAnalytics() {
        // Fetch Overview
        callApi("GET", BASEURL + "analytics/overview", null, (overviewData) => {
            try {
                const overview = JSON.parse(overviewData);
                // Fetch Charts
                callApi("GET", BASEURL + "analytics/charts", null, (chartData) => {
                    try {
                        const charts = JSON.parse(chartData);
                        this.setState({
                            analyticsData: {
                                overview: overview,
                                charts: charts
                            }
                        });
                    } catch (e) { }
                });
            } catch (e) { }
        });
    }

    fetchDiversions() {
        callApi("GET", BASEURL + "traffic/read", null, (data) => {
            try {
                const posts = JSON.parse(data);
                // Filter posts where type is "Diversion"
                const activeDiversions = posts.filter(p => p.type === "Diversion");
                this.setState({ diversions: activeDiversions });
            } catch (e) { }
        });
    }

    fetchUsers() {
        // Optimization: Fetch ALL users in one query as requested
        callApi("GET", BASEURL + "users/all", null, (data) => {
            try {
                this.setState({ users: JSON.parse(data) });
            } catch (e) {
                console.error("Error fetching users", e);
            }
        });
    }

    editUser(email) {
        const statusStr = prompt("Update Status (0: Pending, 1: Active, 2: Rejected):", "1");
        if (statusStr) {
            const status = parseInt(statusStr);
            const payload = { email: email, status: status };

            // Using direct fetch to ensure JSON.stringify is applied (handling potential api.js cache issues)
            fetch(BASEURL + "users/updateStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(res => res.text())
                .then(resp => {
                    if (resp.includes("200")) {
                        alert("✅ User status updated via Database!");
                        this.fetchUsers();
                    } else {
                        alert("❌ Update failed: " + resp);
                    }
                })
                .catch(err => alert("Error: " + err));
        }
    }

    createDiversion() {
        const road = prompt("Enter Road Name:");
        const reason = prompt("Enter Reason (e.g. Construction, VIP):");
        if (road && reason) {
            const payload = {
                title: road,
                description: reason,
                type: "Diversion",
                location: road, // Using road name as location for simplicity
                severity: "High",
                status: 1 // Verified by Admin
            };

            fetch(BASEURL + "traffic/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(res => res.text())
                .then(resp => {
                    if (resp.includes("200")) {
                        alert(`🚧 New Diversion Created in Database!`);
                        this.fetchDiversions(); // Refresh list
                    } else {
                        alert("Failed to create diversion");
                    }
                });
        }
    }

    overrideSignal(junction, action) {
        if (confirm(`⚠️ CONFIRM: Force ${action} at ${junction}? This will override AI control.`)) {
            alert(`✅ signal at ${junction} is now FORCED ${action.toUpperCase()}`);
        }
    }

    fetchDriverStats() {
        callApi("GET", BASEURL + "gamification/driver/" + this.props.userid, null, (data) => {
            try {
                this.setState({ driverStats: JSON.parse(data) });
            } catch (e) {
                console.error("Failed to parse gamification data", e);
            }
        });
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
                            <div className="control-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
                                <div className="card-panel">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid var(--bg-light)', paddingBottom: '10px' }}>
                                        <h4 style={{ margin: 0, border: 0 }}>Active Diversions</h4>
                                        <button className="btn-add" style={{ fontSize: '0.85rem', padding: '8px 16px' }} onClick={() => this.createDiversion()}>+ New Diversion</button>
                                    </div>

                                    <div className="diversion-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                                        {this.state.diversions.length > 0 ? this.state.diversions.map((d, i) => (
                                            <div key={i} className="diversion-card">
                                                <div className="div-header">
                                                    <span className="icon">🚧</span>
                                                    <span className="title">{d.title}</span>
                                                    <span className="badge-severity high">High</span>
                                                </div>
                                                <div className="div-body">
                                                    <label>Reason</label>
                                                    <p>{d.description}</p>
                                                </div>
                                                <div className="div-footer">
                                                    <small>Location: {d.location || d.title}</small>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="empty-state">
                                                <p>No active diversions. Traffic flowing normally.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card-panel">
                                    <h4>Signal Priority Override</h4>
                                    <div className="signal-control">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label>Jubilee Checkpost</label>
                                            <div className="signal-lights">
                                                <span className="light red active"></span>
                                                <span className="light yellow"></span>
                                                <span className="light green"></span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0 10px 0' }}>Current Mode: <strong>Emergency Block</strong></p>
                                        <button className="btn-approve" style={{ width: '100%' }} onClick={() => this.overrideSignal('Jubilee Checkpost', 'Green')}>Force Green (Clear)</button>
                                    </div>
                                    <div className="signal-control" style={{ marginTop: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label>KBR Park Junction</label>
                                            <div className="signal-lights">
                                                <span className="light red"></span>
                                                <span className="light yellow"></span>
                                                <span className="light green active"></span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0 10px 0' }}>Current Mode: <strong>Normal Flow</strong></p>
                                        <button className="btn-approve" style={{ background: '#dc3545', width: '100%' }} onClick={() => this.overrideSignal('KBR Park Junction', 'Red')}>Force Red (Stop)</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'analytics':
                    const congestionData = {
                        labels: ['09:00', '12:00', '15:00', '18:00', '21:00'],
                        datasets: [
                            {
                                label: 'Congestion Level',
                                data: this.state.analyticsData ? this.state.analyticsData.charts.congestion : [],
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            },
                        ],
                    };
                    const emissionData = {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [
                            {
                                label: 'CO2 Emissions (kg)',
                                data: this.state.analyticsData ? this.state.analyticsData.charts.emissions : [],
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            },
                        ],
                    };
                    return (
                        <div className="tab-content">
                            <h3>📊 Smart City Analytics</h3>
                            <div className="analytics-summary" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div className="stat-card" style={{ borderLeft: '5px solid #3b82f6', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Fleet</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{this.state.analyticsData ? this.state.analyticsData.overview.totalFleet : '...'}</div>
                                </div>
                                <div className="stat-card" style={{ borderLeft: '5px solid #10b981', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Active Routes</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{this.state.analyticsData ? this.state.analyticsData.overview.activeRoutes : '...'}</div>
                                </div>
                                <div className="stat-card" style={{ borderLeft: '5px solid #f59e0b', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Trips Today</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{this.state.analyticsData ? this.state.analyticsData.overview.tripsToday : '...'}</div>
                                </div>
                            </div>

                            <div className="analytics-extra" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="card-panel">
                                    <h4>Congestion Trends (Today)</h4>
                                    <div style={{ height: '300px', padding: '10px' }}>
                                        {this.state.analyticsData ? <Line options={{ responsive: true, maintainAspectRatio: false }} data={congestionData} /> : 'Loading Chart...'}
                                    </div>
                                </div>
                                <div className="card-panel">
                                    <h4>Emissions Analysis (Weekly)</h4>
                                    <div style={{ height: '300px', padding: '10px' }}>
                                        {this.state.analyticsData ? <Bar options={{ responsive: true, maintainAspectRatio: false }} data={emissionData} /> : 'Loading Chart...'}
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
                case 'user_management':
                    return (
                        <div className="tab-content">
                            <h3>👥 User & Role Management</h3>
                            <p>Manage access for Admins, Managers, and Drivers.</p>
                            <table className="dashboard-table">
                                <thead>
                                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {this.state.users.length > 0 ? this.state.users.map((u, i) => (
                                        <tr key={i}>
                                            <td>{u.fullname}</td>
                                            <td>{u.email}</td>
                                            <td>{u.role === 1 ? 'Admin' : u.role === 2 ? 'Manager' : 'Driver'}</td>
                                            <td>
                                                <span className={`status-badge status-${u.status}`}>
                                                    {u.status === 1 ? 'Active' : u.status === 2 ? 'Rejected' : 'Pending'}
                                                </span>
                                            </td>
                                            <td><button className="btn-secondary" onClick={() => this.editUser(u.email)}>Edit</button></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5">Loading Users...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    );
                case 'profile':
                    return <Profile />;
                default:
                    return <TrafficDashboard />;
            }
        }

        // --- DRIVER VIEWS ---
        else {
            switch (activeView) {
                // ... (existing cases)
                case 'ev_charging':
                    return (
                        <div className="tab-content">
                            <h3>⚡ EV Charging Guidance</h3>
                            <div className="card-panel">
                                <h4>Nearby Stations</h4>
                                <ul className="alert-list">
                                    <li className="alert-item ok">🔋 <strong>Station A (2km)</strong>: 4 Fast Chargers (Available)</li>
                                    <li className="alert-item warning">🔋 <strong>Station B (5km)</strong>: 2 Chargers (Wait time: 10m)</li>
                                </ul>
                                <button className="btn-primary" style={{ marginTop: '15px' }}>Navigate to Nearest Charger</button>
                            </div>
                        </div>
                    );
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
                                    <p>Cargo: Medical Supplies</p>
                                    <div className="progress-bar"><div style={{ width: '40%' }}></div></div>
                                    <button className="btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => this.setState({ activeView: 'navigation' })}>Start Navigation</button>
                                </div>
                                <div className="route-card">
                                    <div className="route-header">
                                        <span className="badge-priority medium">Scheduled</span>
                                        <span className="route-time">Pick up: 14:00</span>
                                    </div>
                                    <h4>City Center &rarr; Warehouse B</h4>
                                    <p>Cargo: General Goods</p>
                                    <button className="btn-secondary" style={{ width: '100%', marginTop: '10px' }} onClick={() => alert("Route Details\n\nFrom: City Center\nTo: Warehouse B\nCargo: General Goods\nPickup Time: 14:00\n\nStatus: Scheduled")}>View Details</button>
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
                    const { driverStats } = this.state;
                    if (!driverStats) return <div>Loading Rewards...</div>;

                    return (
                        <div className="tab-content">
                            <h3>🏆 Driver Incentives & Rewards</h3>
                            <div className="stats-container">
                                <div className="stat-card gold">
                                    <h3>Eco Score</h3>
                                    <h1>{driverStats.ecoScore}/100</h1>
                                    <p>Excellent Driving!</p>
                                </div>
                                <div className="stat-card blue">
                                    <h3>Reward Points</h3>
                                    <h1>{driverStats.rewardPoints}</h1>
                                    <p>Redeemable</p>
                                </div>
                            </div>
                            <h4>Your Achievements</h4>
                            <div className="achievements-list">
                                {driverStats.achievements && driverStats.achievements.map((ach, idx) => (
                                    <div key={idx} className={`achievement-item ${ach.status}`}>
                                        <span className="icon">{ach.icon}</span>
                                        <div>
                                            <strong>{ach.title}</strong>
                                            <p>{ach.desc}</p>
                                        </div>
                                    </div>
                                ))}
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
            <div className="dashboard-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <div className="sidebar-container" style={{ width: '260px', flexShrink: 0, borderRight: '1px solid #ddd' }}>
                    <MenuBar manualMenus={menuList} onMenuClick={this.handleMenuClick} />
                </div>
                <div className="main-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Header title={this.state.isDriver ? "Driver Dashboard" : "NeuroFleetX Admin"} user={userid} />
                    <div className="content-scrollable" style={{ flexGrow: 1, overflowY: 'auto', padding: '25px', background: '#f8f9fa' }}>
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}
