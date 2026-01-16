import React, { Component } from 'react'
import '../css/Profile.css'
import { BASEURL, callApi, getSession } from '../api';

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      user: {
        fullname: '',
        email: '',
        role: '',
        password: '' // Keep empty for security unless editing
      },
      originalUser: {}
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.fetchProfile = this.fetchProfile.bind(this);
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile() {
    let csr = getSession("csrid");
    if (csr !== "") {
      let data = { csrid: csr };
      console.log("Fetching profile with payload:", data); // Debug log
      
      fetch(BASEURL + "users/getdetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) throw new Error(response.status + " " + response.statusText);
        return response.text();
      })
      .then(response => {
        try {
          console.log("Raw profile response:", response);
          let userData = JSON.parse(response);
          this.setState({
             user: userData,
             originalUser: {...userData}
          });
        } catch (e) {
            console.error("Error parsing user data", e);
        }
      })
      .catch(error => console.error("Fetch profile error:", error));
    }
  }

  toggleEdit() {
    this.setState(prevState => {
        if (prevState.isEditing) {
            // Cancel edit - revert
            return {
                isEditing: false,
                user: {...prevState.originalUser}
            };
        }
        return { isEditing: true };
    });
  }

  handleChange(e) {
      const { id, value } = e.target;
      this.setState(prevState => ({
          user: {
              ...prevState.user,
              [id]: value
          }
      }));
  }

  saveProfile() {
      // Validate
      if(this.state.user.fullname === "" || this.state.user.password === "") {
          alert("All fields are required");
          return;
      }
      
      console.log("Updating profile with payload:", this.state.user);
      fetch(BASEURL + "users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state.user)
      })
      .then(res => {
          if(!res.ok) throw new Error(res.status + " " + res.statusText);
          return res.text();
      })
      .then(res => {
          let data = res.split("::");
          if(data[0] === "200") {
              alert(data[1]);
              sessionStorage.setItem("user", JSON.stringify(this.state.user));
              window.location.replace("/admin");
          } else {
              alert(data[1]);
          }
      })
      .catch(err => alert("Error updating profile: " + err));
  }

  getRoleName(role) {
      switch(parseInt(role)) {
          case 1: return "Admin";
          case 2: return "Manager";
          case 3: return "Driver";
          case 4: return "Customer";
          default: return "Unknown";
      }
  }

  render() {
    const { user, isEditing } = this.state;
    
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src="/images/profile.png" alt="Profile" className="profile-img" />
            </div>
            <h2>My Profile</h2>
          </div>
          
          <div className="profile-details">
            <div className="detail-row">
              <label>Full Name</label>
              <input 
                type="text" 
                id="fullname" 
                value={user.fullname || ''} 
                disabled={!isEditing}
                onChange={this.handleChange} 
              />
            </div>
            
            <div className="detail-row">
              <label>Email</label>
              <input 
                type="email" 
                id="email" 
                value={user.email || ''} 
                disabled={true} 
              />
            </div>

            <div className="detail-row">
              <label>Role</label>
              <input 
                type="text" 
                value={this.getRoleName(user.role)} 
                disabled={true} 
              />
            </div>
            
            <div className="detail-row">
                <label>Password</label>
                <input 
                    type="password" 
                    id="password"
                    value={user.password || ''} 
                    disabled={!isEditing}
                    onChange={this.handleChange}
                    placeholder={isEditing ? "Enter new password" : "********"}
                />
            </div>
          </div>

          <div className="action-buttons">
            {isEditing ? (
              <>
                <button className="btn-primary" onClick={this.saveProfile}>Save Changes</button>
                <button className="btn-secondary" onClick={this.toggleEdit}>Cancel</button>
              </>
            ) : (
              <button className="btn-primary" onClick={this.toggleEdit}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
