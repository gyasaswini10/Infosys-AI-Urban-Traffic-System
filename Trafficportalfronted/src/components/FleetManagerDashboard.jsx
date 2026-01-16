import React, { Component } from 'react';
import { BASEURL, callApi } from '../api';
import '../css/AdminDashboard.css'; // Re-use Admin styles

export default class FleetManagerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'vehicles',
            vehicles: [],
            drivers: [],
            activeTab: 'vehicles',
            vehicles: [],
            drivers: [],
            incidents: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        // Fetch Vehicles
        callApi("GET", BASEURL + "vehicle/all", null, (data) => {
            try { this.setState({ vehicles: JSON.parse(data) }); } catch(e) { console.error("Vehicles parse error", e); this.setState({vehicles: []}); }
        });

        // Fetch Drivers
        callApi("GET", BASEURL + "users/role/3", null, (data) => {
             try { this.setState({ drivers: JSON.parse(data) }); } catch(e) { console.error("Drivers parse error", e); this.setState({drivers: []}); }
        });


        // Fetch Traffic Incidents
        callApi("GET", BASEURL + "traffic/read", null, (data) => {
            try { this.setState({ incidents: JSON.parse(data) }); } catch(e) { console.error("Incidents parse error", e); this.setState({incidents: []}); }
        });
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

    updateIncidentStatus(id, status) {
        callApi("POST", BASEURL + "traffic/updateStatus", JSON.stringify({ id: id, status: status }), () => {
            alert("Incident Status Updated");
            this.fetchData();
        });
    }

    render() {
        const { activeTab, vehicles, drivers, incidents } = this.state;

        return (
            <div className="dashboard-container" style={{padding:'20px'}}>
                <h1>Traffic Manager Dashboard</h1>
                <div className="tabs" style={{marginBottom:'20px', borderBottom:'1px solid #ccc'}}>
                    <button className={activeTab === 'incidents' ? 'active-tab' : ''} onClick={() => this.setState({ activeTab: 'incidents' })} style={{padding:'10px 20px', marginRight:'10px', background: activeTab==='incidents'?'#007bff':'#f0f0f0', color:activeTab==='incidents'?'white':'black', border:'none'}}>Traffic Incidents</button>
                    <button className={activeTab === 'vehicles' ? 'active-tab' : ''} onClick={() => this.setState({ activeTab: 'vehicles' })} style={{padding:'10px 20px', marginRight:'10px', background: activeTab==='vehicles'?'#007bff':'#f0f0f0', color:activeTab==='vehicles'?'white':'black', border:'none'}}>Vehicles</button>
                    <button className={activeTab === 'drivers' ? 'active-tab' : ''} onClick={() => this.setState({ activeTab: 'drivers' })} style={{padding:'10px 20px', marginRight:'10px', background: activeTab==='drivers'?'#007bff':'#f0f0f0', color:activeTab==='drivers'?'white':'black', border:'none'}}>Drivers</button>
                </div>

                {activeTab === 'incidents' && (
                    <div className="tab-content">
                        <h3>Incident Verification</h3>
                         <table className="dashboard-table">
                            <thead>
                                <tr><th>Title</th><th>Location</th><th>Type</th><th>Severity</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {Array.isArray(incidents) && incidents.map(i => (
                                    <tr key={i.id}>
                                        <td>{i.title}</td><td>{i.location}</td><td>{i.type}</td>
                                        <td><span className={`status-badge ${i.severity === 'High' ? 'status-rejected' : 'status-pending'}`}>{i.severity}</span></td>
                                        <td><span className={`status-badge status-${i.status ? i.status : 0}`}>{i.status === 1 ? 'Verified' : i.status === 2 ? 'Rejected' : 'Pending'}</span></td>
                                        <td>
                                            <div className="action-btn-group">
                                                {i.status !== 1 && <button onClick={() => this.updateIncidentStatus(i.id, 1)} className="btn-approve">Verify</button>}
                                                {i.status !== 2 && <button onClick={() => this.updateIncidentStatus(i.id, 2)} className="btn-reject">Reject</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'vehicles' && (
                    <div className="tab-content">
                        <h3>Vehicle Approvals</h3>
                         <table className="dashboard-table">
                            <thead>
                                <tr><th>ID</th><th>Reg No</th><th>Model</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
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
                        <h3>Active Vehicles</h3>
                        <p>{Array.isArray(vehicles) ? vehicles.filter(v => v.status === 1).length : 0} vehicles active.</p>
                    </div>
                )}

                {activeTab === 'drivers' && (
                    <div className="tab-content">
                        <h3>Drivers List</h3>
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
                )}

            </div>
        );
    }
}
