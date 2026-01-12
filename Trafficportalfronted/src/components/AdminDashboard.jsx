import React, { Component } from 'react'
import '../css/AdminDashboard.css'
import { BASEURL, callApi } from '../api';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: { total: 0, active: 0, inactive: 0, pending: 0 },
            vehicles: [],
            viewMode: 'grid', // 'list' or 'grid'
            showModal: false,
            newVehicle: {
                regNo: '',
                type: 'Car',
                model: '',
                status: 3, // Default Pending (3)
                tirePressure: 32,
                healthStatus: 'Good'
            }
        };
        this.fetchData = this.fetchData.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addVehicle = this.addVehicle.bind(this);
        this.deleteVehicle = this.deleteVehicle.bind(this);
        this.approveVehicle = this.approveVehicle.bind(this);
        this.simulateTelemetry = this.simulateTelemetry.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        // Polling to get latest updates from backend simulation AND local simulation
        this.interval = setInterval(() => {
            // this.fetchData(); // Optional: Fetch from backend if backend also simulates
            this.simulateTelemetry(); // Local simulation for smooth UI
        }, 3000); 
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
            let fetchedVehicles = JSON.parse(data);
            
            // Filter if Driver
            if(this.props.role === 3) { // Driver
                fetchedVehicles = fetchedVehicles.filter(v => v.userid == this.props.userid);
            }

            // Default initialization for new telemetry fields if missing
            const vehicles = fetchedVehicles.map(v => ({
                ...v,
                speed: v.speed || 0,
                tirePressure: v.tirePressure || 32,
                healthStatus: v.healthStatus || 'Good',
                batteryLevel: v.batteryLevel !== undefined ? v.batteryLevel : 100
            }));
            this.setState({ vehicles });
        });
    }

    simulateTelemetry() {
        this.setState(prevState => ({
            vehicles: prevState.vehicles.map(v => {
                if (v.status === 1) { // Active
                    // Simulate speed (0-120 km/h)
                    let newSpeed = (v.speed || 0) + (Math.random() * 20 - 10);
                    newSpeed = Math.max(0, Math.min(120, newSpeed));

                    // Simulate Tire Pressure (28-36 PSI)
                    let newPressure = (v.tirePressure || 32) + (Math.random() * 1 - 0.5);
                    newPressure = Math.max(28, Math.min(36, newPressure));

                    // Simulate Battery/Fuel Depletion
                    let newBattery = (v.batteryLevel || 100) - 0.1;
                    newBattery = Math.max(0, newBattery);

                    // Health Check Logic
                    let newHealth = 'Good';
                    if (newPressure < 30) newHealth = 'Low Tire Pressure';
                    if (newBattery < 15) newHealth = 'Low Fuel/Battery';
                    if (newSpeed > 100) newHealth = 'Over Speeding';

                    return { 
                        ...v, 
                        speed: parseFloat(newSpeed.toFixed(1)),
                        tirePressure: parseFloat(newPressure.toFixed(1)),
                        batteryLevel: parseFloat(newBattery.toFixed(1)),
                        healthStatus: newHealth
                    };
                }
                return v;
            })
        }));
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
        
        // Attach userid
        const vehicleToAdd = {
            ...newVehicle,
            userid: this.props.userid
        };

        callApi("POST", BASEURL + "vehicle/add", JSON.stringify(vehicleToAdd), (res) => {
            let data = res.split("::");
            if (data[0] === "200") {
                alert("Vehicle Submitted for Approval!");
                this.toggleModal();
                this.fetchData(); // Refresh data
                this.setState({ newVehicle: { regNo: '', type: 'Car', model: '', status: 3, tirePressure: 32, healthStatus: 'Good' } }); // Reset form
            } else {
                alert(data[1]);
            }
        });
    }

    deleteVehicle(vehicleId) {
        if(window.confirm("Are you sure you want to remove this vehicle?")) {
            callApi("POST", BASEURL + "vehicle/delete", JSON.stringify({vehicleId: vehicleId}), (res) => {
                 this.fetchData(); // Refresh list
                 alert("Vehicle removed successfully");
            });
             // Optimistic update
             this.setState(prev => ({
                 vehicles: prev.vehicles.filter(v => v.vehicleId !== vehicleId)
             }));
        }
    }

    approveVehicle(vehicleId) {
        if(window.confirm("Approve this vehicle for the fleet?")) {
            callApi("POST", BASEURL + "vehicle/updateStatus", JSON.stringify({vehicleId: vehicleId, status: 1}), (res) => {
                this.fetchData(); 
                alert("Vehicle Approved!");
            });
             // Optimistic update
             this.setState(prev => ({
                vehicles: prev.vehicles.map(v => v.vehicleId === vehicleId ? {...v, status: 1} : v)
            }));
        }
    }

    rejectVehicle(vehicleId) {
        if(window.confirm("Reject this vehicle application?")) {
            callApi("POST", BASEURL + "vehicle/updateStatus", JSON.stringify({vehicleId: vehicleId, status: 4}), (res) => {
                this.fetchData(); 
                alert("Vehicle Rejected!");
            });
             // Optimistic update
             this.setState(prev => ({
                vehicles: prev.vehicles.map(v => v.vehicleId === vehicleId ? {...v, status: 4} : v)
            }));
        }
    }

    renderGrid(vehicles) {
        return (
            <div className="vehicle-grid">
                {vehicles.map(v => (
                    <div className="vehicle-card" key={v.vehicleId}>
                        <div className="card-header">
                            <span className="card-id">#{v.vehicleId}</span>
                            <span className={`status-chip status-${v.status}`}>
                                {v.status === 1 ? 'Active' : v.status === 3 ? 'Pending' : v.status === 4 ? 'Rejected' : 'Inactive'}
                            </span>
                             {this.props.role === 1 && (
                                <i className="fas fa-trash trash-icon" 
                                   onClick={(e) => {e.stopPropagation(); this.deleteVehicle(v.vehicleId)}}
                                   style={{cursor:'pointer', color:'#ef4444', marginLeft:'auto'}}
                                ></i>
                             )}
                        </div>
                        <h3>{v.model}</h3>
                        <p className="reg-no">{v.regNo}</p>
                        
                        <div className="telemetry-grid">
                            <div className="telemetry-item">
                                <span className="label">Speed</span>
                                <span className="value">{v.speed || 0} <small>km/h</small></span>
                            </div>
                            <div className="telemetry-item">
                                <span className="label">Tire Press.</span>
                                <span className="value" style={{color: (v.tirePressure<30?'red':'inherit')}}>{v.tirePressure} <small>PSI</small></span>
                            </div>
                        </div>

                        <div className="health-status">
                             <span className={`health-dot ${v.healthStatus === 'Good' ? 'good' : 'bad'}`}></span>
                             {v.healthStatus}
                        </div>

                        {v.status === 3 && this.props.role === 1 && (
                            <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                                <button className="btn-approve" onClick={() => this.approveVehicle(v.vehicleId)} style={{flex:1}}>
                                    Approve
                                </button>
                                <button className="btn-reject" onClick={() => this.rejectVehicle(v.vehicleId)} style={{flex:1, background: '#ef4444', color:'white', border:'none', borderRadius:'4px', padding:'5px'}}>
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const { stats, vehicles, showModal, newVehicle, viewMode } = this.state;
        const isDriver = this.props.role === 3;
        const isAdmin = this.props.role === 1;

        return (
            <div className="admin-dashboard">
                {/* Metrics Cards */}
                <div className="metrics-container">
                    <div className="metric-card">
                        <div className="metric-info">
                            <h3>Total Fleet</h3>
                            <h1>{isAdmin ? stats.total : vehicles.length}</h1>
                        </div>
                        <div className="icon-box total-blue"><i className="fas fa-car"></i></div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-info">
                            <h3>Active Fleet</h3>
                            <h1>{isAdmin ? stats.active : vehicles.filter(v=>v.status===1).length}</h1>
                        </div>
                        <div className="icon-box active-green"><i className="fas fa-check-circle"></i></div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-info">
                            <h3>Pending Approval</h3>
                            <h1>{vehicles.filter(v=>v.status===3).length}</h1>
                        </div>
                        <div className="icon-box inactive-red"><i className="fas fa-clock"></i></div>
                    </div>
                </div>

                {/* Vehicle List */}
                <div className="vehicle-section">
                    <div className="section-header">
                        <h2>{isDriver ? "My Vehicles" : "Fleet Management & Telemetry"}</h2>
                        <div style={{display:'flex', gap:'10px'}}>
                            <button className={`btn-view ${viewMode==='grid'?'active':''}`} onClick={()=>this.setState({viewMode:'grid'})}>Grid</button>
                            <button className={`btn-view ${viewMode==='list'?'active':''}`} onClick={()=>this.setState({viewMode:'list'})}>List</button>
                            {(isAdmin || isDriver) && <button className="btn-add" onClick={this.toggleModal}>+ Register Vehicle</button>}
                        </div>
                    </div>
                    
                    {viewMode === 'grid' ? this.renderGrid(vehicles) : (
                        <table className="vehicle-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Reg No</th>
                                    <th>Model</th>
                                    <th>Status</th>
                                    <th>Speed</th>
                                    <th>Tire Pressure</th>
                                    <th>Health</th>
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map(v => (
                                    <tr key={v.vehicleId}>
                                        <td>#{v.vehicleId}</td>
                                        <td>{v.regNo}</td>
                                        <td>{v.model}</td>
                                        <td>
                                            <span className={`status-badge status-${v.status}`}>
                                                {v.status === 1 ? 'Active' : v.status === 3 ? 'Pending' : v.status === 4 ? 'Rejected' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{v.speed} km/h</td>
                                        <td style={{color: v.tirePressure < 30 ? 'red' : 'inherit'}}>{v.tirePressure} PSI</td>
                                        <td>{v.healthStatus}</td>
                                        {isAdmin && (
                                        <td>
                                            <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                                                {v.status === 3 && (
                                                    <>
                                                        <button className="btn-sm-approve" onClick={()=>this.approveVehicle(v.vehicleId)}>Approve</button>
                                                        <button className="btn-sm-reject" onClick={()=>this.rejectVehicle(v.vehicleId)} style={{background: '#ef4444', color:'white', border:'none', borderRadius:'4px', padding:'5px 10px', cursor:'pointer'}}>Reject</button>
                                                    </>
                                                )}
                                                <button className="btn-icon-delete" onClick={()=>this.deleteVehicle(v.vehicleId)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
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
                            <h3>Register New Vehicle</h3>
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
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Model</label>
                                <input name="model" value={newVehicle.model} onChange={this.handleInputChange} placeholder="e.g. Toyota Innova" />
                            </div>
                            <div className="form-group">
                                <label>Initial Status</label>
                                <select name="status" value={newVehicle.status} disabled>
                                    <option value="3">Pending Approval</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={this.toggleModal}>Cancel</button>
                                <button className="btn-add" onClick={this.addVehicle}>Submit for Approval</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
