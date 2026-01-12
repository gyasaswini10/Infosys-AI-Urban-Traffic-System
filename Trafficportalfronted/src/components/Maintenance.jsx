import React, { Component } from 'react';
import '../css/AdminDashboard.css'; // Reusing existing dashboard styles
import { BASEURL, callApi } from '../api';

export default class Maintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            predictions: [],
            loading: true
        };
        this.loadPredictions = this.loadPredictions.bind(this);
    }

    componentDidMount() {
        callApi("GET", BASEURL + "maintenance/prediction", null, this.loadPredictions);
    }

    loadPredictions(response) {
        try {
            const data = JSON.parse(response);
            this.setState({ predictions: data, loading: false });
        } catch (e) {
            console.error(e);
            this.setState({ loading: false });
        }
    }

    render() {
        const { predictions, loading } = this.state;
        const criticalCount = predictions.filter(p => p.status === 'Critical').length;
        const dueSoonCount = predictions.filter(p => p.status === 'Due Soon').length;

        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h2>Predictive Maintenance</h2>
                </div>

                <div className="stats-container">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
                        <h3>Critical Attention</h3>
                        <p>{criticalCount}</p>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <h3>Service Due Soon</h3>
                        <p>{dueSoonCount}</p>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981, #047857)' }}>
                        <h3>Healthy Fleet</h3>
                        <p>{predictions.length - criticalCount - dueSoonCount}</p>
                    </div>
                </div>

                <div className="vehicle-list-container">
                    <h3>Vehicle Health Report</h3>
                    {loading ? <p>Loading analysis...</p> : (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Reg No</th>
                                        <th>Engine Health</th>
                                        <th>Tire Health</th>
                                        <th>Mileage</th>
                                        <th>Status</th>
                                        <th>Recommended Action</th>
                                        <th>Issues Detected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {predictions.map((p, index) => (
                                        <tr key={index}>
                                            <td>{p.regNo}</td>
                                            <td>
                                                <div className="health-bar-container">
                                                    <div 
                                                        className="health-bar" 
                                                        style={{
                                                            width: `${p.engineHealth}%`, 
                                                            backgroundColor: p.engineHealth < 70 ? '#ef4444' : '#10b981'
                                                        }}
                                                    ></div>
                                                    <span>{p.engineHealth}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="health-bar-container">
                                                    <div 
                                                        className="health-bar" 
                                                        style={{
                                                            width: `${p.tireHealth}%`, 
                                                            backgroundColor: p.tireHealth < 60 ? '#ef4444' : '#10b981'
                                                        }}
                                                    ></div>
                                                    <span>{p.tireHealth}%</span>
                                                </div>
                                            </td>
                                            <td>{p.mileage.toFixed(1)} km</td>
                                            <td>
                                                <span 
                                                    className="status-badge"
                                                    style={{
                                                        backgroundColor: p.status === 'Critical' ? '#fee2e2' : p.status === 'Due Soon' ? '#fef3c7' : '#d1fae5',
                                                        color: p.status === 'Critical' ? '#991b1b' : p.status === 'Due Soon' ? '#92400e' : '#065f46'
                                                    }}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td>{p.action}</td>
                                            <td style={{color: '#6b7280', fontSize: '0.9em'}}>{p.issues || 'None'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                <style>{`
                    .health-bar-container {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        width: 100px;
                    }
                    .health-bar {
                        height: 6px;
                        border-radius: 3px;
                    }
                `}</style>
            </div>
        );
    }
}
