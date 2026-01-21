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
            <div className="tab-content" style={{ padding: '0' }}>
                <div className="section-header" style={{ marginBottom: '20px' }}>
                    <h2>Predictive Maintenance</h2>
                    <button className="btn-primary" style={{ width: 'auto' }} onClick={() => this.loadPredictions(JSON.stringify(predictions))}>Refresh Analysis</button>
                </div>

                <div className="metrics-container">
                    <div className="metric-card" style={{ borderLeft: '4px solid #ef4444' }}>
                        <div className="metric-info">
                            <h3>Critical Attention</h3>
                            <h1 style={{ color: '#ef4444' }}>{criticalCount}</h1>
                        </div>
                        <div className="icon-box" style={{ background: '#fee2e2', color: '#ef4444' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <div className="metric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                        <div className="metric-info">
                            <h3>Service Due Soon</h3>
                            <h1 style={{ color: '#f59e0b' }}>{dueSoonCount}</h1>
                        </div>
                        <div className="icon-box" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                            <i className="fas fa-clock"></i>
                        </div>
                    </div>
                    <div className="metric-card" style={{ borderLeft: '4px solid #10b981' }}>
                        <div className="metric-info">
                            <h3>Healthy Fleet</h3>
                            <h1 style={{ color: '#10b981' }}>{predictions.length - criticalCount - dueSoonCount}</h1>
                        </div>
                        <div className="icon-box" style={{ background: '#d1fae5', color: '#10b981' }}>
                            <i className="fas fa-check-circle"></i>
                        </div>
                    </div>
                </div>

                <div className="card-panel">
                    <h4 style={{ marginBottom: '20px' }}>Vehicle Health Report</h4>
                    {loading ? <p>Loading analysis...</p> : (
                        <div className="table-responsive">
                            <table className="dashboard-table">
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
                                            <td style={{ fontWeight: '600' }}>{p.regNo}</td>
                                            <td>
                                                <div className="health-bar-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div
                                                        style={{
                                                            width: '60px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden'
                                                        }}
                                                    >
                                                        <div style={{ width: `${p.engineHealth}%`, height: '100%', background: p.engineHealth < 70 ? '#ef4444' : '#10b981' }}></div>
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', width: '30px' }}>{p.engineHealth}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="health-bar-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div
                                                        style={{
                                                            width: '60px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden'
                                                        }}
                                                    >
                                                        <div style={{ width: `${p.tireHealth}%`, height: '100%', background: p.tireHealth < 60 ? '#ef4444' : '#10b981' }}></div>
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', width: '30px' }}>{p.tireHealth}%</span>
                                                </div>
                                            </td>
                                            <td>{p.mileage.toFixed(1)} km</td>
                                            <td>
                                                <span
                                                    className={`status-badge ${p.status === 'Critical' ? 'status-inactive' : p.status === 'Due Soon' ? 'status-pending' : 'status-active'}`}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td>{p.action}</td>
                                            <td style={{ color: '#6b7280', fontSize: '0.9em', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.issues}>{p.issues || 'None'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
