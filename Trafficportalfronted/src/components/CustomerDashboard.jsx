import React, { Component } from 'react';
import { BASEURL, callApi } from '../api';
import '../css/AdminDashboard.css';
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
                    <div className="placeholder-view">
                         <h2>My Traffic Alerts</h2>
                         <p>Subscribed Areas: <strong>Hitech City, Jubilee Hills</strong></p>
                         <ul className="alert-list">
                             <li className="alert-item">🚧 Construction on Road No 45 (Delay 10m)</li>
                             <li className="alert-item">🌧️ Heavy Rain Warning: Avoid Low lying areas</li>
                         </ul>
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
        return (
            <div className="dashboard-container">
                <MenuBar manualMenus={CUSTOMER_MENU} onMenuClick={this.handleMenuClick} />
                <div className="dashboard-content">
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
