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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
        console.log("Menu Clicked:", menuId); // Debugging
        const selected = CUSTOMER_MENU.find(m => m.mid == menuId); // Loose equality for safety
        if (selected) {
            console.log("Setting View:", selected.view); // Debugging
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

    analyzeRoute() {
        // Generate random mock data to simulate different route conditions
        const baseTraffic = Math.floor(Math.random() * 40) + 20; // 20-60 base
        const peakMultiplier = Math.random() * 2 + 1; // 1x to 3x surge
        
        const newData = [
            baseTraffic, 
            Math.floor(baseTraffic * peakMultiplier), 
            Math.floor(baseTraffic * peakMultiplier * 0.9), 
            baseTraffic + 10, 
            baseTraffic, 
            baseTraffic + 20, 
            Math.floor(baseTraffic * 1.5), 
            baseTraffic
        ];

        const peakStart = Math.floor(Math.random() * 4) + 7; // 7 AM to 10 AM
        const peakEnd = peakStart + 2;

        this.setState({
            predictionData: {
                labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                datasets: [{
                    fill: true,
                    label: 'Predicted Traffic Volume',
                    data: newData,
                    borderColor: peakMultiplier > 2 ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)', // Red if high traffic
                    backgroundColor: peakMultiplier > 2 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(53, 162, 235, 0.2)',
                    tension: 0.4
                }]
            },
            predictionWarning: {
                times: `${peakStart > 12 ? peakStart-12 : peakStart}:00 ${peakStart >= 12 ? 'PM' : 'AM'} - ${peakEnd > 12 ? peakEnd-12 : peakEnd}:00 ${peakEnd >= 12 ? 'PM' : 'AM'}`,
                level: peakMultiplier > 2 ? 'CRITICAL' : peakMultiplier > 1.5 ? 'HIGH' : 'MODERATE'
            }
        });
    }

    renderContent() {
        const { activeView, myBookings, predictionData, predictionWarning } = this.state;

        switch (activeView) {
            // ... (cases)
            case 'travel_predictor':
                return (
                    <div className="tab-content">
                        <h3>⏳ Travel Time Predictor</h3>
                        <div className="card-panel">
                             <h4>Predict Tomorrow's Traffic</h4>
                             <div style={{display:'flex', gap:'10px', margin:'15px 0'}}>
                                 <input type="text" placeholder="Source Point" className="input-field" style={{padding:'10px', flex:1}} />
                                 <input type="text" placeholder="Destination" className="input-field" style={{padding:'10px', flex:1}} />
                                 <button className="btn-primary" onClick={() => this.analyzeRoute()}>Analyze</button>
                             </div>
                             
                             {predictionData && (
                                 <div className="prediction-results" style={{marginTop:'20px'}}>
                                     <div className={`alert-card ${predictionWarning.level === 'CRITICAL' ? 'critical' : predictionWarning.level === 'HIGH' ? 'warning' : 'info'}`}>
                                         <h4>⚠️ {predictionWarning.level} Congestion Warning</h4>
                                         <p>Expect {predictionWarning.level.toLowerCase()} congestion on this route between <strong>{predictionWarning.times}</strong> tomorrow.</p>
                                     </div>
                                     <div style={{height:'300px', background:'#fff', padding:'10px', borderRadius:'8px', marginTop:'10px', boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
                                         <Line 
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: { position: 'top' },
                                                    title: { display: true, text: 'Hourly Traffic Trend Forecast (Tomorrow)' }
                                                }
                                            }} 
                                            data={predictionData} 
                                         />
                                     </div>
                                 </div>
                             )}
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
