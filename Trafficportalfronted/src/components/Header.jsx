import React from 'react';
import { setSession } from '../api';
import '../css/Header.css'; // We'll create this or reuse standard styles

const Header = ({ title, user }) => {
    const logout = () => {
        setSession("csrid", "", -1);
        sessionStorage.clear();
        window.location.replace("/");
    };

    return (
        <div className="app-header">
            <div className="header-left">
                <img src="/images/traffic-symbol-icon-png-1.png" alt="Logo" style={{width:'32px', height:'32px'}} />
                <h2>{title}</h2>
            </div>
            
            <div className="header-right">
                <div className="user-info">
                    <span className="user-name">{user || 'User'}</span>
                    <span className="user-status">Online</span>
                </div>
                <button onClick={logout} className="btn-logout">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Header;
