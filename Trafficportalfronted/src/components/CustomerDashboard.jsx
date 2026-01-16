import React, { Component } from 'react';
import { BASEURL, callApi } from '../api';
import '../css/AdminDashboard.css';
import Header from './Header';
import MenuBar from './MenuBar';
import { CUSTOMER_MENU } from './MenuConstants';
import TrafficDashboard from './TrafficDashboard';
import RouteOptimization from './RouteOptimization';
import TrafficPosting from './TrafficPosting';
import TrafficSearch from './TrafficSearch';
import Profile from './Profile';

export default class CustomerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeView: 'live_traffic', // Default
            myBookings: []
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    componentDidMount() {
        this.fetchMyBookings();
    }

    handleMenuClick(menuId) {
        const selected = CUSTOMER_MENU.find(m => m.mid === menuId);
        if (selected) {
            this.setState({ activeView: selected.view });
        }
    }

    fetchMyBookings() {
        // Keeping legacy booking logic just in case "Travel History" needs it
        const email = this.props.userid;
        if(email) {
            callApi("GET", BASEURL + "booking/customer/" + email, null, (data) => {
                try {
                     this.setState({ myBookings: JSON.parse(data) }); 
                } catch(e) {
                     this.setState({ myBookings: [] });
                }
            });
        }
    }

    renderContent() {
        const { activeView, myBookings } = this.state;

        switch (activeView) {
            case 'live_traffic':
                return <TrafficDashboard />;
            case 'route_planner':
                return <RouteOptimization />;
            case 'traffic_alerts':
                return (
                    <div className="tab-content">
                         <h3>🔔 My Traffic Alerts</h3>
                         
                         <div className="alert-card critical">
                            <div className="alert-header">
                                <span className="icon">🌧️</span>
                                <h4>Heavy Rain Warning</h4>
                                <span className="time">10 mins ago</span>
                            </div>
                            <p>Severe waterlogging reported in <strong>Hitech City, Madhapur</strong>. Avoid low-lying areas. Expect delays of 45+ mins.</p>
                         </div>

                         <div className="alert-card warning">
                            <div className="alert-header">
                                <span className="icon">🚧</span>
                                <h4>Road Construction</h4>
                                <span className="time">1 hour ago</span>
                            </div>
                            <p><strong>Road No 45 Jubilee Hills</strong> is partially closed for Metro work. Use alternative route via KBR Park.</p>
                         </div>

                         <div className="alert-card info">
                            <div className="alert-header">
                                <span className="icon">📢</span>
                                <h4>Rally Notification</h4>
                                <span className="time">Yesterday</span>
                            </div>
                            <p>Political rally expected near <strong>Necklace Road</strong> tomorrow 10 AM - 2 PM. Plan travel accordingly.</p>
                         </div>

                         <div className="subscription-box">
                             <h4>Manage Subscriptions</h4>
                             <label><input type="checkbox" checked readOnly/> Peak Hour Alerts</label>
                             <label><input type="checkbox" checked readOnly/> Accident Reports</label>
                             <label><input type="checkbox" /> Air Quality Warnings</label>
                         </div>
                    </div>
                );
            case 'traffic_search':
                return <TrafficSearch />;
            case 'travel_predictor':
                return (
                    <div className="tab-content">
                        <h3>⏳ Travel Time Predictor</h3>
                        <div className="card-panel">
                             <h4>Predict Tomorrow's Traffic</h4>
                             <div style={{display:'flex', gap:'10px', margin:'15px 0'}}>
                                 <input type="text" placeholder="Source Point" className="input-field" style={{padding:'10px', flex:1}} />
                                 <input type="text" placeholder="Destination" className="input-field" style={{padding:'10px', flex:1}} />
                                 <button className="btn-primary" onClick={() => alert("Predictions Loaded")}>Analyze</button>
                             </div>
                             <div className="prediction-results" style={{marginTop:'20px'}}>
                                 <div className="alert-card info">
                                     <h4>⚠️ Peak Hour Warning</h4>
                                     <p>Expect high congestion on this route between <strong>08:30 AM - 10:30 AM</strong> tomorrow.</p>
                                 </div>
                                 <div style={{height:'200px', background:'#eef2f7', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px', marginTop:'10px'}}>
                                     📉 [Graph: Hourly Traffic Trend Forecast]
                                 </div>
                             </div>
                        </div>
                    </div>
                );
            case 'public_transport':
                 return (
                    <div className="tab-content">
                        <h3>🚇 Public Transport Status</h3>
                        <div className="transport-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                            <div className="card-panel">
                                <h4>Metro Delays</h4>
                                <ul className="alert-list">
                                    <li className="alert-item ok">✅ Red Line: On Time</li>
                                    <li className="alert-item warning">⚠️ Blue Line: 5 min delay (Technical Issue)</li>
                                    <li className="alert-item ok">✅ Green Line: On Time</li>
                                </ul>
                            </div>
                            <div className="card-panel">
                                <h4>Bus Services</h4>
                                 <ul className="alert-list">
                                    <li className="alert-item warning">⚠️ Route 47C: Diverted via Road 12</li>
                                    <li className="alert-item ok">✅ Route 10H: Operating Normal</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-panel" style={{marginTop:'20px'}}>
                            <h4>Multimodal Planner</h4>
                             <p>Combine Metro + Last Mile Auto/Cab for fastest reach.</p>
                             <button className="btn-secondary">Plan Multimodal Trip</button>
                        </div>
                    </div>
                 );
            case 'post_report':
                return <TrafficPosting />;
            case 'travel_history':
                return (
                    <div className="tab-content">
                        <h3>Travel History</h3>
                        {(!myBookings || myBookings.length === 0) ? <p>No travel history found.</p> : (
                            <table className="dashboard-table">
                                <thead>
                                    <tr><th>ID</th><th>Vehicle</th><th>Dates</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(myBookings) && myBookings.map(b => (
                                        <tr key={b.bookingId}>
                                            <td>#{b.bookingId}</td>
                                            <td>#{b.vehicleId}</td>
                                            <td>{b.startDate} to {b.endDate}</td>
                                            <td>{b.status === 1 ? 'Pending' : b.status === 2 ? 'Approved' : 'Rejected'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            case 'eco_routes':
                 // Re-using route optimizer but we could pass a prop to pre-select 'eco'
                 return <RouteOptimization defaultMode="eco" />;
            case 'profile':
                return <Profile />;
            default:
                return <TrafficDashboard />;
        }
    }

    render() {
        const { userid } = this.props;
        return (
            <div className="dashboard-layout" style={{display:'flex', height:'100vh', overflow:'hidden'}}>
                <div className="sidebar-container" style={{width:'260px', flexShrink:0, borderRight:'1px solid #ddd'}}>
                    <MenuBar manualMenus={CUSTOMER_MENU} onMenuClick={this.handleMenuClick} />
                </div>
                <div className="main-content" style={{flexGrow:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
                    <Header title="Citizen Portal" user={userid} />
                    <div className="content-scrollable" style={{flexGrow:1, overflowY:'auto', padding:'25px', background:'#f8f9fa'}}>
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}
