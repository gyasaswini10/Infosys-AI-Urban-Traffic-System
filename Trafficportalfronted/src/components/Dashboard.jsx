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


export default class Dashboard extends Component {
  constructor() {
    super()
    this.state =
    {
      fullname: "",
      role:0,
      activeComponent:null,
      manualMenus: []
    }
    this.logout=this.logout.bind(this);
    this.loadComponent=this.loadComponent.bind(this);
    this.showFullname=this.showFullname.bind(this);
  }

  componentDidMount() {
    let sid = getSession("csrid");
    if(sid === "")
      window.location.replace("/");
    
    callApi("POST", "http://localhost:8080/users/getdetails", sid, (res)=> {
        let user = JSON.parse(res);
        this.setState({role: user.role});
        this.showFullname(user.fullname);

        // Define Menus based on Role (Manual Override for Security/UX)
        let roleMenus = [];
        if(user.role === 1) { // Admin
             roleMenus = [
                 {mid: "1", menu: "Fleet Dashboard", icon: "images/list.png"}, 
                 {mid: "7", menu: "AI Route Engine", icon: "images/image.png"},
                 {mid: "8", menu: "Maintenance", icon: "images/image.png"}, // New
                 {mid: "5", menu: "Traffic Analysis", icon: "images/image.png"}, 
                 {mid: "4", menu: "Traffic Posting", icon: "images/pen.jpeg"}, 
                 {mid: "2", menu: "Traffic Search", icon: "images/searchicon.png"},
                 {mid: "3", menu: "My Profile", icon: "images/user.png"}
             ];
             this.setState({activeComponent: <AdminDashboard role={user.role}/>});
        } else if(user.role === 2) { // Manager
             roleMenus = [
                 {mid: "1", menu: "Fleet Dashboard", icon: "images/list.png"},
                 {mid: "7", menu: "AI Route Engine", icon: "images/image.png"},
                 {mid: "8", menu: "Maintenance", icon: "images/image.png"}, // New
                 {mid: "6", menu: "Post Incident", icon: "images/pen.jpeg"}, 
                 {mid: "5", menu: "Traffic Analysis", icon: "images/image.png"}, 
                 {mid: "3", menu: "My Profile", icon: "images/user.png"}
             ];
             this.setState({activeComponent: <TrafficPosting/>});
        } else { // Driver/Customer
             roleMenus = [
                 {mid: "1", menu: "Fleet Dashboard", icon: "images/list.png"},
                 {mid: "2", menu: "Search Incidents", icon: "images/searchicon.png"},
                 {mid: "3", menu: "My Profile", icon: "images/user.png"}
             ];
             this.setState({activeComponent: <TrafficSearch/>});
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
    // Dynamic Component Loading
    if(mid === "1") {
        this.setState({activeComponent: <AdminDashboard role={this.state.role}/>});
        return;
    }
    if(mid === "6") { // Manager Post Incident
        this.setState({activeComponent: <TrafficPosting/>});
        return;
    }

    // New Mappings
    let componentMap = {
        "2": <TrafficSearch/>,
        "3": <Profile/>,
        "4": <TrafficPosting/>, 
        "5": <TrafficDashboard/>,
        "7": <RouteOptimization/>,
        "8": <Maintenance/>
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