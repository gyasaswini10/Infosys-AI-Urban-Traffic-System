import React, { Component } from 'react';
import '../css/AdminDashboard.css';
import { BASEURL, callApi } from '../api';

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Leaflet
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// PDF Export
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fix Leaflet Marker Icon
 delete L.Icon.Default.prototype._getIconUrl;
 L.Icon.Default.mergeOptions({
   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
 });

export default class TrafficDashboard extends Component {
    constructor() {
        super();
        this.state = {
            stats: { total: 0, active: 0, inactive: 0 },
            vehicles: [],
            hourlyData: {
                labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                datasets: [
                  {
                    label: 'Trips Started',
                    data: [12, 19, 3, 5, 2, 3, 10], // Mock Data for MVP
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  },
                ],
            },
            loading: true
        };
        this.exportReport = this.exportReport.bind(this);
    }

    componentDidMount() {
        // Fetch Fleet Statistics
        callApi("GET", BASEURL + "vehicle/stats", null, (data) => {
             this.setState({ stats: JSON.parse(data) });
        });

        // Fetch Fleet Locations for Heatmap
        callApi("GET", BASEURL + "vehicle/all", null, (data) => {
            this.setState({ vehicles: JSON.parse(data), loading: false });
        });
    }

    exportReport() {
        const doc = new jsPDF();
        doc.text("Urban Mobility Insights Report", 20, 10);
        
        const { stats, vehicles } = this.state;
        
        // Summary
        doc.text(`Total Fleet: ${stats.total}`, 20, 20);
        doc.text(`Active Vehicles: ${stats.active}`, 20, 30);
        
        // Vehicle Table
        const tableColumn = ["ID", "Reg No", "Model", "Status", "Location"];
        const tableRows = [];

        vehicles.forEach(vehicle => {
            const vehicleData = [
                vehicle.vehicleId,
                vehicle.regNo,
                vehicle.model,
                vehicle.status === 1 ? "Active" : "Inactive",
                vehicle.location
            ];
            tableRows.push(vehicleData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 40 });
        doc.save("mobility_report.pdf");
    }

    render() {
        const { stats, vehicles, hourlyData, loading } = this.state;

        if (loading) return <div>Loading Analytics...</div>;

        // Calculate center for map (simple average of visible points or hardcoded city center)
        const center = [17.3850, 78.4867]; // Hyderabad coords as default

        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h2>Urban Mobility Insights</h2>
                    <button className="btn-add" onClick={this.exportReport}>
                        <i className="fas fa-download"></i> Export Report
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="stats-container">
                    <div className="stat-card" style={{background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>
                        <h3>Total Fleet</h3>
                        <p>{stats.total}</p>
                    </div>
                    <div className="stat-card" style={{background: 'linear-gradient(135deg, #10b981, #047857)'}}>
                        <h3>Active Routes</h3>
                        <p>{stats.active}</p>
                    </div>
                    <div className="stat-card" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                        <h3>Trips Today</h3>
                        <p>{stats.active * 12 + 5} <small style={{fontSize:'0.5em'}}>(Est)</small></p>
                    </div>
                </div>

                <div className="analytics-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'20px'}}>
                    
                    {/* Fleet Heatmap / Map Distribution */}
                    <div className="card-panel" style={{background:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                        <h3>Fleet Distribution Heatmap</h3>
                        <div style={{height: '400px', width: '100%'}}>
                            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {vehicles.map(v => (
                                    // Randomize lat/lng slightly if "location" is just a city name, or map city names to coords
                                    // For MVP, assuming "Garage" or city names map to near center, 
                                    // normally v.location would be lat,lng. 
                                    // I'll simulate distribution around center.

                                        <Circle 
                                            center={[
                                                center[0] + (Math.random() - 0.5) * 0.1, 
                                                center[1] + (Math.random() - 0.5) * 0.1
                                            ]}
                                            pathOptions={{ fillColor: v.status===1?'green':'red', color: v.status===1?'green':'red' }}
                                            radius={500}
                                            key={v.vehicleId}
                                        >
                                            <Popup>
                                                <b>{v.regNo}</b><br/>
                                                {v.model}<br/>
                                                Status: {v.status === 1 ? 'Active' : 'Idle'}
                                            </Popup>
                                        </Circle>

                                ))}
                            </MapContainer>
                        </div>
                    </div>

                    {/* Hourly Activity Chart */}
                    <div className="card-panel" style={{background:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                        <h3>Hourly Rental Activity</h3>
                        <Bar options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                            },
                        }} data={hourlyData} />
                    </div>

                </div>
            </div>
        );
    }
}
