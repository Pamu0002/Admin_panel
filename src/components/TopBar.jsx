import React, { useState, useEffect } from 'react';
import './TopBar.css';
import logo from '../assets/images/logo.png';
import { FiBell } from 'react-icons/fi'; // Replaced with react-icons for bell

const TopBar = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) {
            setGreeting('Good Morning!');
        } else if (hours >= 12 && hours < 18) {
            setGreeting('Good Afternoon!');
        } else {
            setGreeting('Good Night!');
        }
    }, []);

    return (
        <div className="topbar">
            <div className="greeting-container">
                <span className="greeting">{greeting}</span>
                <span className="subtitle">Your Health, Our Priority</span>
            </div>

            <div className="right-section">
                <FiBell className="notification-icon" />
                <div className="user-info">
                <img className="profile-image" src={logo} alt="Admin Profile" />
                    <span>Mr Admin</span>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
