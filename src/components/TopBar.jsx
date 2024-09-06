import React from 'react';
import './TopBar.css';
import logo from '../assets/images/logo.png'; // Importing the image

const TopBar = () => {
    return (
        <div className="topbar">
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-image" /> {/* Add image here */}
                <span className="logo-medi">Medi</span>
                <span className="logo-connect">Connect</span>
            </div>
            <div className="user-info">
                <span>Mr Admin</span>
            </div>
        </div>
    );
};

export default TopBar;
