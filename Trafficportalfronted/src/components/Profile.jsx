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
      let data = JSON.stringify({ csrid: csr });
      callApi("POST", BASEURL + "users/getdetails", data, (response) => {
        try {
          let userData = JSON.parse(response);
          this.setState({
             user: userData,
             originalUser: {...userData} // Create copy
          });
        } catch (e) {
            console.error("Error parsing user data", e);
        }
      });
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
      
      callApi("POST", BASEURL + "users/update", JSON.stringify(this.state.user), (res) => {
          let data = res.split("::");
          if(data[0] === "200") {
              alert(data[1]);
              this.setState({
                  isEditing: false,
                  originalUser: {...this.state.user}
              });
          } else {
              alert(data[1]);
          }
      });
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
