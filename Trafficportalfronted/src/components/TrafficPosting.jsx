import React, { Component } from 'react'
import '/src/css/JobPosting.css'; // You might want to rename this CSS file later if needed, but keeping it for now
import { BASEURL, callApi } from '../api';

class TrafficPosting extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      title: '',
      location: '',
      type: '',
      severity: '',
      description: '',
      trafficincidents: []
    };
    this.readResponse = this.readResponse.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.saveResponse = this.saveResponse.bind(this);
    this.loadInputChange = this.loadInputChange.bind(this);
  }

  componentDidMount() {
    callApi("GET", BASEURL + "traffic/read", "", this.readResponse);
  }

  readResponse(response) {
    if (response.includes("404::")) {
      alert(response.split("::")[1]);
      return;
    }
    try {
        let data = JSON.parse(response);
        this.setState({ trafficincidents: data });
    } catch(e) {
        console.error("Error parsing response", e);
    }
  }

  updateData(id) {
    callApi("GET", BASEURL + "traffic/getdata/" + id, "", this.updateResponse);
  }

  updateResponse(response) {
    if (response.includes("404::")) {
      alert(response.split("::")[1]);
      return;
    }
    let data = JSON.parse(response);
    this.setState({
      id: data.id,
      title: data.title,
      location: data.location,
      type: data.type,
      severity: data.severity,
      description: data.description
    });
    this.showPopup();
  }

  deleteData(id) {
    let resp = confirm("Click OK to confirm the deletion");
    if (resp === false)
      return;
    callApi("DELETE", BASEURL + "traffic/delete/" + id, "", this.saveResponse);
  }

  loadInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  savePost() {
    let data = {
        id: this.state.id,
        title: this.state.title,
        location: this.state.location,
        type: this.state.type,
        severity: this.state.severity,
        description: this.state.description
    };
    callApi("POST", BASEURL + "traffic/create", data, this.saveResponse)
  }

  saveResponse(response) {
    let data = response.split("::");
    if(data.length > 1)
        alert(data[1]);
    else 
        alert(response);
    window.location.reload(); // Simple reload to refresh data
  }

  showPopup() {
    let popup = document.getElementById('jppopup');
    if(popup) popup.style.display = "block";
  }

  closepopup() {
    let popup = document.getElementById('jppopup');
    if(popup) popup.style.display = "none";
    // Reset form
    this.setState({
        id: '',
        title: '',
        location: '',
        type: '',
        severity: '',
        description: ''
    });
  }

  render() {
    const { title, location, type, severity, description, trafficincidents } = this.state;
    return (
      <div className='jpcontainer'>
        <div id='jppopup' className='popup'>
          <div className='popupwindow'>
            <div className='popupheader'>
              <label>Post Traffic Incident</label>
              <span onClick={() => this.closepopup()}>&times;</span>
            </div>
            <div className='popupcontent'>
              <label>Incident Title</label>
              <input type='text' name='title' value={title} onChange={this.loadInputChange} placeholder="e.g. Broken Signal"/>
              
              <label>Location</label>
              <input type='text' name='location' value={location} onChange={this.loadInputChange} placeholder="e.g. MG Road, Junction 4"/>
              
              <label>Incident Type</label>
              <select name='type' value={type} onChange={this.loadInputChange} >
                <option value=""></option>
                <option value="Accident">Accident</option>
                <option value="Congestion">Congestion</option>
                <option value="Roadwork">Roadwork</option>
                <option value="Hazard">Hazard</option>
                <option value="Closure">Road Closure</option>
              </select>
              
              <label>Severity</label>
              <select name='severity' value={severity} onChange={this.loadInputChange}>
                  <option value=""></option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
              </select>
              
              <label>Description</label>
              <textarea rows="5" name='description' value={description} onChange={this.loadInputChange} ></textarea>
              
              <button onClick={() => this.savePost()}>Submit Alert</button>
            </div>
          </div>
          <div className='popupfooter'></div>
        </div>
        
        <div className='header'>
          <label>Traffic Incidents</label>
        </div>
        
        <div className='content'>
          {trafficincidents.map((data) => (
            <div className='result' key={data.id}> 
              <div className='div1' style={{borderBottom:'none', marginBottom:'5px', alignItems:'flex-start'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{fontSize: '0.85rem', color: '#666', marginBottom:'2px'}}>Incident Title</div>
                    <label style={{fontSize:'1.1rem'}}>{data.title}</label>
                </div>
                <div style={{display:'flex', gap:'5px'}}>
                    <img src='images/bin.jpeg' alt='delete' onClick={() => this.deleteData(data.id)} width={"25px"} style={{cursor:'pointer'}}/>
                    <img src='images/pen.jpeg' alt='edit' onClick={() => this.updateData(data.id)} width={"25px"} style={{cursor:'pointer'}}/>
                </div>
              </div>
              <div className='div2' style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'10px', marginTop:'5px'}}>
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
        
        <div className='footer'>
          <button onClick={() => this.showPopup()}>Report Incident</button>
        </div>
      </div>
    )
  }
}
export default TrafficPosting
