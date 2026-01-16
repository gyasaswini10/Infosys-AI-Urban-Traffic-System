import React, { Component } from 'react';
import { BASEURL, callApi } from '../api';
import '../css/AdminDashboard.css'; // Re-use styles
import TrafficDashboard from './TrafficDashboard';

export default class CustomerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'traffic' // 'traffic' or 'bookings' (legacy)
        };
    }

    componentDidMount() {
        this.fetchData();
        this.fetchMyBookings();
    }

    fetchData() {
        callApi("GET", BASEURL + "vehicle/all", null, (data) => {
            try { 
                const allVehicles = JSON.parse(data);
                this.setState({ vehicles: Array.isArray(allVehicles) ? allVehicles.filter(v => v.status === 1) : [] }); 
            } catch(e) { 
                console.error("Vehicles parse error", e); 
                this.setState({vehicles: []}); 
            }
        });
    }

    fetchMyBookings() {
        const email = this.props.userid;
        if(email) {
            callApi("GET", BASEURL + "booking/customer/" + email, null, (data) => {
                try {
                     this.setState({ myBookings: JSON.parse(data) }); 
                } catch(e) {
                     console.error("Bookings parse error", e);
                     this.setState({ myBookings: [] });
                }
            });
        }
    }

    handleBook(vehicleId) {
        const email = this.props.userid;
        const startDate = prompt("Enter Start Date (YYYY-MM-DD):");
        const endDate = prompt("Enter End Date (YYYY-MM-DD):");

        if (startDate && endDate) {
            const booking = {
                vehicleId: vehicleId,
                customerId: email,
                startDate: startDate,
                endDate: endDate,
                status: 1 // Pending
            };

            callApi("POST", BASEURL + "booking/add", JSON.stringify(booking), (res) => {
                alert(res.split("::")[1]);
                this.fetchMyBookings();
            });
        }
    }

    render() {
        const { vehicles, myBookings, view } = this.state;

        return (
            <div className="dashboard-container" style={{padding:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h1>Citizen Dashboard</h1>
                    <div>
                        <button onClick={() => this.setState({view: 'traffic'})} style={{marginRight:'10px'}}>Traffic & Pollution</button>
                        <button onClick={() => {sessionStorage.clear(); window.location.href='/login';}} style={{padding:'5px 10px', background:'#6c757d', color:'white', border:'none', borderRadius:'4px'}}>Logout</button>
                    </div>
                </div>

                {view === 'traffic' && (
                    <div style={{marginTop:'20px'}}>
                        <TrafficDashboard />
                    </div>
                )}

                {view === 'bookings' && (
                    <div className="bookings-list" style={{marginTop:'20px'}}>
                        <h3>My Bookings</h3>
                        {(!myBookings || myBookings.length === 0) ? <p>No bookings found.</p> : (
                            <table className="dashboard-table">
                                <thead>
                                    <tr><th>ID</th><th>Vehicle ID</th><th>Dates</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(myBookings) && myBookings.map(b => (
                                        <tr key={b.bookingId}>
                                            <td>#{b.bookingId}</td>
                                            <td>#{b.vehicleId}</td>
                                            <td>{b.startDate} to {b.endDate}</td>
                                            <td>
                                                <span className={`status-badge status-${b.status}`}>
                                                    {b.status === 1 ? 'Pending' : b.status === 2 ? 'Approved' : 'Rejected'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
