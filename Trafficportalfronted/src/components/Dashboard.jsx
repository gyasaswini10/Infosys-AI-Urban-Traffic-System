import React, { Component } from 'react';
import { callApi, setSession, getSession } from '../api';
import { Navigate } from 'react-router-dom';

export default class Dashboard extends Component {
  constructor() {
    super();
    // We don't need complex state, just redirect logic
    this.state = {
      redirectPath: null,
      loading: true
    };
  }

  componentDidMount() {
    let sid = getSession("csrid");
    if(!sid || sid === "") {
        window.location.replace("/");
        return;
    }
    
    // Fetch user details to decide where to go
    callApi("POST", "http://localhost:8080/users/getdetails", {"csrid":sid}, (res)=> {
        try {
            let user = JSON.parse(res);
            sessionStorage.setItem("user", JSON.stringify(user));
            
            // Redirect based on Role
            if(user.role === 1) this.setState({ redirectPath: "/admin" }); // Admin
            else if(user.role === 2) this.setState({ redirectPath: "/fleet-manager" }); // Fleet Manager
            else if(user.role === 3) this.setState({ redirectPath: "/driver" }); // Driver
            else if(user.role === 4) this.setState({ redirectPath: "/customer" }); // Customer
            else this.setState({ redirectPath: "/" }); // Fallback
            
        } catch(e) {
            console.error("Error parsing user details", e);
            // window.location.replace("/");
        } finally {
            this.setState({ loading: false });
        }
    });
  }

  render() {
      if (this.state.redirectPath) {
          return <Navigate to={this.state.redirectPath} replace />;
      }
      
      return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', flexDirection:'column'}}>
            <h2>Loading NeuroFleetX...</h2>
            <div className="loader"></div>
        </div>
      );
  }
}