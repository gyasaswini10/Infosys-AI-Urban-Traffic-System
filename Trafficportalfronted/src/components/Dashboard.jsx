import React, { Component } from 'react'
import '../css/Dashboard.css'
import { callApi, setSession, getSession } from '../api'

import TrafficPosting from './TrafficPosting';
import TrafficSearch from './TrafficSearch';
import Profile from './Profile';
import AdminDashboard from './AdminDashboard';
import MenuBar from './MenuBar';
import TrafficDashboard from './TrafficDashboard';
import RouteOptimization from './RouteOptimization';
import Maintenance from './Maintenance';
import FleetManagerDashboard from './FleetManagerDashboard';
import CustomerDashboard from './CustomerDashboard'; // Generic Container

export default class Dashboard extends Component {
  constructor() {
    super()
    this.state =
    {
      fullname: "",
      role:0,
      activeComponent:null,
      manualMenus: [],
      userid: null
    }
    this.logout=this.logout.bind(this);
    this.loadComponent=this.loadComponent.bind(this);
    this.showFullname=this.showFullname.bind(this);
  }

  componentDidMount() {
    let sid = getSession("csrid");
    if(sid === "")
      window.location.replace("/");
    
    callApi("POST", "http://localhost:8080/users/getdetails", JSON.stringify({"csrid":sid}), (res)=> {
        let user = JSON.parse(res);
        this.setState({role: user.role, userid: user.email});
        this.showFullname(user.fullname);

        // Define Menus based on NeuroFleetX Roles
        let roleMenus = [];
        
        if(user.role === 1) { // Admin (City Controller)
             roleMenus = [
                 {mid: "1", menu: "City Overview", icon: "images/list.png"}, // Stats & Map
                 {mid: "7", menu: "Traffic Control", icon: "images/image.png"}, // AI Routes
                 {mid: "5", menu: "Analytics", icon: "images/image.png"}, // Heatmaps
                 {mid: "8", menu: "Maintenance", icon: "images/image.png"}, // Fleet Health
                 {mid: "2", menu: "Incident Search", icon: "images/searchicon.png"},
                 {mid: "6", menu: "Post Alert", icon: "images/pen.jpeg"},
                 {mid: "3", menu: "Profile", icon: "images/user.png"}
             ];
             this.setState({activeComponent: <AdminDashboard role={user.role} userid={user.userid}/>});
        } 
        else if(user.role === 2) { // Fleet Manager
             roleMenus = [
                 {mid: "1", menu: "Fleet Command", icon: "images/list.png"}, // Inventory & Verification
                 {mid: "7", menu: "Route Assignment", icon: "images/image.png"}, // Optimization
                 {mid: "8", menu: "Predictive Maint.", icon: "images/image.png"}, // Health
                 {mid: "5", menu: "Live Tracking", icon: "images/image.png"}, // Map
                 {mid: "3", menu: "Profile", icon: "images/user.png"}
             ];
             this.setState({activeComponent: <FleetManagerDashboard role={user.role} userid={user.userid}/>});
        } 
        else if(user.role === 4) { // Citizen (Traffic User)
             roleMenus = [
                 {mid: "5", menu: "Live Traffic Map", icon: "images/image.png"}, // Main Map
                 {mid: "7", menu: "Smart Route Planner", icon: "images/image.png"}, // AI Routes
                 {mid: "6", menu: "Report Incident", icon: "images/pen.jpeg"}, // Community Reporting
                 {mid: "2", menu: "Traffic Search", icon: "images/searchicon.png"},
                 {mid: "3", menu: "My Profile", icon: "images/user.png"}
             ];
             // Default to Map for Citizen
             this.setState({activeComponent: <TrafficDashboard/>});
        } 
        else { // Driver (Field Unit)
             roleMenus = [
                 {mid: "7", menu: "AI Navigation", icon: "images/image.png"}, // Routes
                 {mid: "6", menu: "Report Issue", icon: "images/pen.jpeg"}, // Reporting
                 {mid: "8", menu: "Vehicle Health", icon: "images/image.png"}, // Maintenance
                 {mid: "3", menu: "My Profile", icon: "images/user.png"}
             ];
             this.setState({activeComponent: <RouteOptimization/>}); 
        }
        
        this.setState({ manualMenus: roleMenus });
    });
  }
  showFullname(response)
  {
    this.setState({fullname:response});
  }
  logout()
  {
    setSession("csrid","",-1);
    window.location.replace("/");
  }

  loadComponent(mid) {
    // Dynamic Component Loading with NeuroFleetX Logic
    if(mid === "1") { // Dashboards
        const {role, userid} = this.state;
        if(role === 1) this.setState({activeComponent: <AdminDashboard role={role} userid={userid}/>});
        else if(role === 2) this.setState({activeComponent: <FleetManagerDashboard role={role} userid={userid}/>});
        else if(role === 4) this.setState({activeComponent: <TrafficDashboard/>}); // Citizen default
        return;
    }
    
    // Feature Modules
    let componentMap = {
        "2": <TrafficSearch/>,
        "3": <Profile/>,
        "4": <TrafficPosting/>, 
        "5": <TrafficDashboard/>, // Live Map
        "6": <TrafficPosting/>, // Reporting
        "7": <RouteOptimization/>, // AI Routing
        "8": <Maintenance/> // Health/Predictions
    };
    
    this.setState({activeComponent: componentMap[mid]});
  }

    render() {
        const{fullname,activeComponent, manualMenus}=this.state;
        if(!fullname) return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading...</div>;
        
        return (
          <div className='dashboard'>
            <div className='headerr'>
              <img className='logo' src='\images\traffic-symbol-icon-png-1.png' alt=''style={{width:40,height:40}}/>
              <img className='logout' onClick={()=>this.logout()} src='./images/logout.png' alt='no'/>
              <label>{fullname}</label>
            </div>
            <div className='menu'>
              <MenuBar onMenuClick ={this.loadComponent} manualMenus={manualMenus}/>
            </div>
            <div className='outlet'>{activeComponent}</div>
          </div>
        )
      }
}