// src/pages/Dashboard.jsx
import React from 'react';
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css'; // Ensure this CSS file is correctly imported

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="stats">
                <div className="stat-item doctors">
                    <FaUserMd size={80} /> {/* Icon for Doctors */}
                    <div>
                        <div>87 </div>
                        <div>Doctors</div>
                    </div>
                </div>
                <div className="stat-item patients">
                    <FaUserInjured size={80} /> {/* Icon for Patients */}
                    <div>
                        <div>1002</div>
                        <div>Patients</div>
                    </div>
                </div>
                <div className="stat-item attended">
                    <FaCalendarCheck size={80} /> {/* Icon for Attended */}
                    <div>
                        <div>352</div>
                        <div>Patients Appoinment</div>
                    </div>
                </div>
                <div className="stat-item pending">
                    <FaCalendarAlt size={80} /> {/* Icon for Pending */}
                    <div>
                        <div>650</div>
                        <div>Pending</div>
                    </div>
                </div>
            </div>
            <div className="charts">
                <div className="chart">Chart Placeholder</div>
                <div className="chart">Chart Placeholder</div>
            </div>
        </div>
    );
};

export default Dashboard;
