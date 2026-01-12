import React, { Component } from "react";
import "/src/css/MenuBar.css";
import { BASEURL, callApi, getSession } from "./../api";

export default class MenuBar extends Component {
  constructor(){
    super();
    this.state = {menuItems : []};
    this.loadMenus = this.loadMenus.bind(this);
  }
  componentDidMount(){
    if(this.props.manualMenus && this.props.manualMenus.length > 0) {
        this.setState({menuItems: this.props.manualMenus});
    } else {
        let csr=getSession("csrid");
        let data = JSON.stringify({csrid:csr});
        callApi("POST", BASEURL + "menus/getmenusbyrole", data, this.loadMenus);
    }
  }
  
  componentDidUpdate(prevProps) {
      if(this.props.manualMenus !== prevProps.manualMenus && this.props.manualMenus) {
          this.setState({menuItems: this.props.manualMenus});
      }
  }
  loadMenus(response){
    let data = JSON.parse(response);
    this.setState({menuItems : data});
  }

  render() {
    const {menuItems} = this.state;
    return (
      <div className="menubar">
        <div className="menuheader">
          MENU <img src="\images\smart traffic .jpg" alt="" />
        </div>
        <div className="menulist">
          <ul>
          {menuItems.map((row) =>(
            <li key={row.mid} onClick={()=>this.props.onMenuClick(row.mid)}>
              {row.menu} <img src = {row.icon} alt='' />
            </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}