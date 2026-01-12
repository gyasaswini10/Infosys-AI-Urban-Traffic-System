import React, { Component } from 'react'
import '/src/css/JobPosting.css'; // Reusing CSS for consistent cards
import { BASEURL, callApi } from '../api';

export class TrafficSearch extends Component {
    constructor() {
        super();
        this.state = {
            searchKey: '',
            results: []
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.updateResults = this.updateResults.bind(this);
    }

    handleSearch() {
        if(this.state.searchKey === "") {
            alert("Please enter a location to search");
            return;
        }
        callApi("GET", BASEURL + "traffic/search/" + this.state.searchKey, "", this.updateResults);
    }

    updateResults(response) {
        if(response.includes("404::")) {
            this.setState({results: []});
            return;
        }
        try {
            let data = JSON.parse(response);
            this.setState({ results: data });
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
            <div className='jpcontainer'>
                <div className='header'>
                    <label>Traffic Incident Search</label>
                </div>
                
                <div className='searchBar' style={{display:'flex', gap:'10px', padding:'20px', justifyContent:'center'}}>
                    <input 
                        type='text' 
                        className='searchText' 
                        placeholder='Search by Location (e.g. Main St)' 
                        value={this.state.searchKey}
                        onChange={(e) => this.setState({searchKey: e.target.value})}
                        style={{padding:'10px', width:'300px', borderRadius:'5px', border:'1px solid #ddd'}}
                    />
                    <button 
                        className='searchButton' 
                        onClick={this.handleSearch}
                        style={{padding:'10px 20px', background:'#4a90e2', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}
                    >
                        Search
                    </button>
                    <button 
                         onClick={() => {this.setState({searchKey:''}); callApi("GET", BASEURL + "traffic/read", "", this.updateResults)}}
                         style={{padding:'10px 20px', background:'#6c757d', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}
                    >
                        Show All
                    </button>
                </div>

                <div className='content'>
                    {this.state.results.length === 0 ? <p style={{textAlign:'center', color:'#666'}}>No incidents found in this area.</p> : null}
                    {this.state.results.map((data) => (
                        <div className='result' key={data.id}>
                            <div className='div1' style={{flexDirection:'column', alignItems:'flex-start'}}>
                                <div style={{fontSize: '0.85rem', color: '#666', marginBottom:'2px'}}>Incident Title</div>
                                <label style={{fontSize:'1.1rem'}}>{data.title}</label>
                            </div>
                            <div className='div2' style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'10px', marginTop:'10px'}}>
                                <div>
                                    <div style={{fontSize: '0.85rem', color: '#666', fontWeight:'600'}}>Location</div>
                                    <div style={{fontSize: '1rem'}}>{data.location}</div>
                                </div>
                                <div>
                                    <div style={{fontSize: '0.85rem', color: '#666', fontWeight:'600'}}>Incident Type</div>
                                    <div style={{fontSize: '1rem'}}>{data.type}</div>
                                </div>
                                <div>
                                    <div style={{fontSize: '0.85rem', color: '#666', fontWeight:'600', marginBottom:'2px'}}>Severity</div>
                                    <span className={data.severity === 'High' || data.severity === 'Critical' ? 'status-inactive' : 'status-active'} 
                                          style={{padding: '2px 10px', borderRadius: '12px', fontSize: '0.9rem', display:'inline-block'}}>
                                        {data.severity}
                                    </span>
                                </div>
                            </div>
                            <div className='div3' style={{marginTop:'15px'}}>
                                <div style={{fontSize: '0.85rem', color: '#666', fontWeight:'600'}}>Description</div>
                                <p style={{marginTop:'2px', fontSize:'0.95rem'}}>{data.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default TrafficSearch
