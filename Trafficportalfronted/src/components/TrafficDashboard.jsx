import React, { Component } from 'react';
import '../css/AdminDashboard.css'; // Reusing CSS for cards and layout
import { BASEURL, callApi } from '../api';

export default class TrafficDashboard extends Component {
    constructor() {
        super();
        this.state = {
            stats: {
                total: 0,
                high: 0,
                medium: 0,
                low: 0,
                critical: 0
            },
            recentIncidents: []
        };
        this.loadStats = this.loadStats.bind(this);
        this.loadRecent = this.loadRecent.bind(this);
    }

    componentDidMount() {
        callApi("GET", BASEURL + "traffic/stats", "", this.loadStats);
        callApi("GET", BASEURL + "traffic/read", "", this.loadRecent);
    }

    loadStats(response) {
        try {
            let data = JSON.parse(response);
            this.setState({ stats: data });
        } catch(e) { console.error(e); }
    }

    loadRecent(response) {
        try {
            let data = JSON.parse(response);
            this.setState({ recentIncidents: data });
        } catch(e) { console.error(e); }
    }

    render() {
        const { stats, recentIncidents } = this.state;
        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h2>Traffic Analysis Dashboard</h2>
                </div>

                <div className="stats-container">
                    <div className="stat-card total">
                        <h3>Total Incidents</h3>
                        <p>{stats.total}</p>
                    </div>
                    <div className="stat-card active" style={{background: 'linear-gradient(135deg, #FF5252, #D32F2F)'}}>
                        <h3>Critical/High</h3>
                        <p>{(stats.high || 0) + (stats.critical || 0)}</p>
                    </div>
                    <div className="stat-card inactive" style={{background: 'linear-gradient(135deg, #FFCA28, #F57C00)'}}>
                        <h3>Medium/Low</h3>
                        <p>{(stats.medium || 0) + (stats.low || 0)}</p>
                    </div>
                </div>

                <div className="vehicle-list-container">
                    <h3>Recent Incidents</h3>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentIncidents.map((inc) => (
                                    <tr key={inc.id}>
                                        <td>{inc.title}</td>
                                        <td>{inc.location}</td>
                                        <td>{inc.type}</td>
                                        <td>
                                            <span className={inc.severity === 'High' || inc.severity === 'Critical' ? 'status-inactive' : 'status-active'}
                                                style={{padding: '5px 10px', borderRadius: '15px'}}
                                            >
                                                {inc.severity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
