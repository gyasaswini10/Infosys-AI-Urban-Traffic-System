import React, { Component } from 'react'
import '../css/AdminDashboard.css'
import { BASEURL, callApi } from '../api';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: { total: 0, active: 0, inactive: 0 },
            vehicles: [],
            viewMode: 'grid', // 'list' or 'grid'
            showModal: false,
            newVehicle: {
                regNo: '',
                type: 'Car',
                model: '',
                status: 1 // Default Active
            }
        };
        this.fetchData = this.fetchData.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addVehicle = this.addVehicle.bind(this);

    }

    componentDidMount() {
        this.fetchData();
        // Polling to get latest updates from backend simulation
        this.interval = setInterval(this.fetchData, 3000); 
    }

    componentWillUnmount() {
        if(this.interval) clearInterval(this.interval);
    }

    fetchData() {
        // Fetch stats
        callApi("GET", BASEURL + "vehicle/stats", null, (data) => {
             this.setState({ stats: JSON.parse(data) });
        });

        // Fetch all vehicles
        callApi("GET", BASEURL + "vehicle/all", null, (data) => {
            this.setState({ vehicles: JSON.parse(data) });
        });
    }

    toggleModal() {
        this.setState(prev => ({ showModal: !prev.showModal }));
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState(prev => ({
            newVehicle: { ...prev.newVehicle, [name]: value }
        }));
    }

    addVehicle() {
        const { newVehicle } = this.state;
        if (!newVehicle.regNo || !newVehicle.model) {
            alert("Reg No and Model are required");
            return;
        }

        callApi("POST", BASEURL + "vehicle/add", JSON.stringify(newVehicle), (res) => {
            let data = res.split("::");
            if (data[0] === "200") {
                alert(data[1]);
                this.toggleModal();
                this.fetchData(); // Refresh data
                this.setState({ newVehicle: { regNo: '', type: 'Car', model: '', status: 1 } }); // Reset form
            } else {
                alert(data[1]);
            }
        });
    }

    renderGrid(vehicles) {
        return (
            <div className="vehicle-grid">
                {vehicles.map(v => (
                    <div className="vehicle-card" key={v.vehicleId}>
                        <div className="card-header">
                            <span className="card-id">#{v.vehicleId}</span>
                            <span className={`status-chip ${v.status === 1 ? 'active' : 'inactive'}`}>
                                {v.status === 1 ? 'In Use' : 'Idle'}
                            </span>
                        </div>
                        <h3>{v.model}</h3>
                        <p className="reg-no">{v.regNo} ({v.type})</p>
                        
                        <div className="telemetry-row">
                            <div className="telemetry-item">
                                <i className="fas fa-map-marker-alt location-icon"></i>
                                <span>{v.location || 'Unknown'}</span>
                            </div>
                            <div className="telemetry-item">
                                <i className="fas fa-tachometer-alt speed-icon"></i>
                                <span>{v.speed || 0} km/h</span>
                            </div>
                        </div>

                        <div className="battery-section">
                            <div className="battery-label">
                                <i className="fas fa-charging-station"></i>
                                <span>Battery</span>
                                <span>{v.batteryLevel || 100}%</span>
                            </div>
                            <div className="battery-bar-bg">
                                <div 
                                    className="battery-bar-fill"
                                    style={{
                                        width: `${v.batteryLevel || 100}%`,
                                        backgroundColor: (v.batteryLevel || 100) < 20 ? '#ff4d4f' : '#52c41a'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const { stats, vehicles, showModal, newVehicle, viewMode } = this.state;
        return (
            <div className="admin-dashboard">
                {/* Metrics Cards */}
                <div className="metrics-container">
                    <div className="metric-card">
                        <div className="metric-info">
                            <h3>Total Vehicles</h3>
                            <h1>{stats.total}</h1>
                        </div>
                        <div className="icon-box total-blue">
                            <i className="fas fa-car"></i>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-info">
                            <h3>Active Fleet</h3>
                            <h1>{stats.active}</h1>
                        </div>
                        <div className="icon-box active-green">
                            <i className="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-info">
                            <h3>Inactive/Maintenance</h3>
                            <h1>{stats.inactive}</h1>
                        </div>
                        <div className="icon-box inactive-red">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                </div>

                {/* Vehicle List */}
                <div className="vehicle-section">
                    <div className="section-header">
                        <h2>Fleet Overview</h2>
                        <div style={{display:'flex', gap:'10px'}}>
                            <button className={`btn-view ${viewMode==='grid'?'active':''}`} onClick={()=>this.setState({viewMode:'grid'})}>Grid</button>
                            <button className={`btn-view ${viewMode==='list'?'active':''}`} onClick={()=>this.setState({viewMode:'list'})}>List</button>
                            {this.props.role === 1 && <button className="btn-add" onClick={this.toggleModal}>+ Add Vehicle</button>}
                        </div>
                    </div>
                    
                    {viewMode === 'grid' ? this.renderGrid(vehicles) : (
                        <table className="vehicle-table">
                            <thead>
                                <tr>
                                    <th>Vehicle ID</th>
                                    <th>Reg No</th>
                                    <th>Type</th>
                                    <th>Model</th>
                                    <th>Status</th>
                                    {this.props.role === 1 && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map(v => (
                                    <tr key={v.vehicleId}>
                                        <td>#{v.vehicleId}</td>
                                        <td>{v.regNo}</td>
                                        <td>{v.type}</td>
                                        <td>{v.model}</td>
                                        <td>
                                            <span className={`status-badge ${v.status === 1 ? 'status-active' : 'status-inactive'}`}>
                                                {v.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        {this.props.role === 1 && (
                                        <td>
                                            <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                                                <img src='images/pen.jpeg' alt='edit' width="20px" style={{cursor:'pointer'}}/>
                                                <img src='images/bin.jpeg' alt='delete' width="20px" style={{cursor:'pointer'}}/>
                                            </div>
                                        </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Add Vehicle Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Add New Vehicle</h3>
                            <div className="form-group">
                                <label>Registration Number</label>
                                <input name="regNo" value={newVehicle.regNo} onChange={this.handleInputChange} placeholder="e.g. TS09 AB 1234" />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select name="type" value={newVehicle.type} onChange={this.handleInputChange}>
                                    <option value="Car">Car</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Model</label>
                                <input name="model" value={newVehicle.model} onChange={this.handleInputChange} placeholder="e.g. Toyota Innova" />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={newVehicle.status} onChange={this.handleInputChange}>
                                    <option value="1">Active</option>
                                    <option value="2">Inactive</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={this.toggleModal}>Cancel</button>
                                <button className="btn-add" onClick={this.addVehicle}>Add Vehicle</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
