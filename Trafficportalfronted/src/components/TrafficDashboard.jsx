import React, { useState, useEffect } from 'react';
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
import { MapContainer, TileLayer, Popup, Circle, LayerGroup } from 'react-leaflet';
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

const TrafficDashboard = () => {
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [vehicles, setVehicles] = useState([]);
    const [hourlyData, setHourlyData] = useState({
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
        datasets: [
          {
            label: 'Trips Started',
            data: [12, 19, 3, 5, 2, 3, 10], // Mock Data for MVP
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // MOCK DATA FOR TESTING - API IS RETURNING 500
        const mockVehicles = [
            { vehicleId: 1, regNo: "TS09EA1234", model: "Tesla Model 3", status: 1, location: "Hyderabad", batteryLevel: 85, speed: 40 },
            { vehicleId: 2, regNo: "TS09EA5678", model: "Tata Nexon EV", status: 2, location: "Secunderabad", batteryLevel: 10, speed: 0 },
            { vehicleId: 3, regNo: "TS09EA9012", model: "Hyundai Kona", status: 1, location: "Hitech City", batteryLevel: 60, speed: 55 }
        ];
        const mockStats = { total: 120, active: 85, inactive: 35 };

        setVehicles(mockVehicles);
        setStats(mockStats);
        setLoading(false);

        /* API DISABLED DUE TO 500 ERRORS
        // Fetch Fleet Statistics
        callApi("GET", BASEURL + "vehicle/stats", null, (data) => {
             setStats(JSON.parse(data));
        });

        // Fetch Fleet Locations for Heatmap
        callApi("GET", BASEURL + "vehicle/all", null, (data) => {
            setVehicles(JSON.parse(data));
            setLoading(false);
        });
        */
    }, []);

    const exportReport = () => {
        const doc = new jsPDF();
        doc.text("Urban Mobility Insights Report", 20, 10);
        
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
    };

    if (loading) return <div>Loading Analytics...</div>;

    // Calculate center for map (simple average of visible points or hardcoded city center)
    const center = [17.3850, 78.4867]; // Hyderabad coords as default

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Urban Mobility Insights</h2>
                <button className="btn-add" onClick={exportReport}>
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
                                {/* <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                /> */}
                                
                                {/* DEBUG: Commenting out vehicles to isolate crash */}
                                {/* <LayerGroup>
                                    {vehicles.map(v => (
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
                                </LayerGroup> */}
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
};

export default TrafficDashboard;
