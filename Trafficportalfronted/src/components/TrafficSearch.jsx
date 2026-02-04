import React, { Component } from 'react';
import '/src/css/JobPosting.css';
import '/src/css/TrafficSearch.css';
import { BASEURL, callApi } from '../api';

function isHyderabadRelated(location, title) {
    const s = [location, title].filter(Boolean).join(' ').toLowerCase();
    return /hyd|hyderabad|secunderabad|sec'bad/i.test(s);
}

export class TrafficSearch extends Component {
    constructor() {
        super();
        this.state = {
            searchKey: '',
            results: [],
            hyderabadOnly: true
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.updateResults = this.updateResults.bind(this);
    }

    handleSearch() {
        if (this.state.searchKey.trim() === '') {
            alert('Please enter a location to search');
            return;
        }
        callApi('GET', BASEURL + 'traffic/search/' + encodeURIComponent(this.state.searchKey.trim()), null, this.updateResults);
    }

    updateResults(response) {
        if (typeof response === 'string' && response.includes('404::')) {
            this.setState({ results: [] });
            return;
        }
        try {
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            this.setState({ results: Array.isArray(data) ? data : [] });
        } catch (e) {
            console.error(e);
            this.setState({ results: [] });
        }
    }

    loadAll = () => {
        this.setState({ searchKey: '' });
        callApi('GET', BASEURL + 'traffic/read', null, this.updateResults);
    };

    render() {
        const { results, hyderabadOnly, searchKey } = this.state;
        const filtered = hyderabadOnly
            ? results.filter((r) => isHyderabadRelated(r.location, r.title))
            : results;

        return (
            <div className="jpcontainer incident-search">
                <div className="searchBar">
                    <input
                        type="text"
                        className="searchText"
                        placeholder="Search by location (e.g. Hyderabad, Secunderabad, Main St)"
                        value={searchKey}
                        onChange={(e) => this.setState({ searchKey: e.target.value })}
                    />
                    <button className="searchButton" onClick={this.handleSearch}>
                        Search
                    </button>
                    <button className="showAllButton" onClick={this.loadAll}>
                        Show All
                    </button>
                    <label className="hyderabad-toggle">
                        <input
                            type="checkbox"
                            checked={hyderabadOnly}
                            onChange={(e) => this.setState({ hyderabadOnly: e.target.checked })}
                        />
                        <span>Hyderabad only</span>
                    </label>
                </div>

                <div className="content">
                    {filtered.length === 0 && (
                        <p className="empty-msg">
                            {results.length === 0
                                ? 'No incidents found. Try "Show All" or search by location.'
                                : 'No Hyderabad-related incidents. Turn off "Hyderabad only" to see all.'}
                        </p>
                    )}
                    {filtered.map((d) => (
                        <div className="incident-card" key={d.id}>
                            <div className="incident-card-header">
                                <h3 className="incident-title">{d.title || '—'}</h3>
                                <span
                                    className={`severity-badge ${d.severity === 'High' || d.severity === 'Critical' ? 'high' : 'low'}`}
                                >
                                    {d.severity || '—'}
                                </span>
                            </div>
                            <div className="incident-card-body">
                                <div className="incident-field">
                                    <span className="field-label">Location</span>
                                    <span className="field-value">{d.location || '—'}</span>
                                </div>
                                <div className="incident-field">
                                    <span className="field-label">Type</span>
                                    <span className="field-value">{d.type || '—'}</span>
                                </div>
                                <div className="incident-field">
                                    <span className="field-label">Description</span>
                                    <p className="field-value description">{d.description || '—'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default TrafficSearch;
