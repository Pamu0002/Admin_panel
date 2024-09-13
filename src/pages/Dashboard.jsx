import React, { useEffect, useState } from 'react';
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaCalendarAlt } from 'react-icons/fa';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase-config'; // Ensure correct path to firebase config
import './Dashboard.css'; // Ensure this CSS file is correctly imported
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import Recharts components

const Dashboard = () => {
    const [doctorCount, setDoctorCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Doctors Count
                const doctorsCollection = collection(db, 'Doctors');
                const doctorsSnapshot = await getDocs(doctorsCollection);
                setDoctorCount(doctorsSnapshot.size); // Count of doctors

                // Fetch Patients Data
                const usersCollection = collection(db, 'user'); // Assuming the collection is named 'user'
                const usersSnapshot = await getDocs(usersCollection);

                // Process patient data for the bar chart
                const patientData = usersSnapshot.docs.map(doc => doc.data());

                // Initialize data structure for weekdays
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const chartDataInit = days.map(day => ({
                    day,
                    patients: 0,
                    pending: 0,
                }));

                // Fill the chart data with patient data from Firestore
                patientData.forEach(patient => {
                    const { weekday, status } = patient; // Correctly using 'weekday' field name
                    const dayIndex = days.indexOf(weekday); // Use 'weekday' to find the index
                    if (dayIndex !== -1) {
                        chartDataInit[dayIndex].patients += 1; // Count patients
                        if (status === 'pending') {
                            chartDataInit[dayIndex].pending += 1; // Count pending patients
                        }
                    }
                });

                setChartData(chartDataInit); // Set chart data
                setPatientCount(usersSnapshot.size); // Total patient count

            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <div className="stats">
                <div className="stat-item doctors">
                    <FaUserMd size={80} /> {/* Icon for Doctors */}
                    <div>
                        <div>{doctorCount}</div> {/* Dynamic Doctor Count */}
                        <div>Doctors</div>
                    </div>
                </div>
                <div className="stat-item patients">
                    <FaUserInjured size={80} /> {/* Icon for Patients */}
                    <div>
                        <div>{patientCount}</div> {/* Dynamic Patient Count */}
                        <div>Patients</div>
                    </div>
                </div>
                <div className="stat-item attended">
                    <FaCalendarCheck size={80} /> {/* Icon for Attended */}
                    <div>
                        <div>2</div>
                        <div>Patients Appointment</div>
                    </div>
                </div>
                <div className="stat-item pending">
                    <FaCalendarAlt size={80} /> {/* Icon for Pending */}
                    <div>
                        <div>1</div>
                        <div>Pending</div>
                    </div>
                </div>
            </div>
            <div className="charts">
                <div className="chart">Chart Placeholder</div>
                {/* Bar Chart */}
                <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            {/* Customize Y-axis with interval */}
                            <YAxis interval={0} domain={[0, 'dataMax + 4']} tickCount={6} />
                            <Tooltip />
                            <Legend />
                            {/* Use CSS variables for bar colors */}
                            <Bar dataKey="patients" fill="var(--patients-bar-color)" />
                            <Bar dataKey="pending" fill="var(--pending-bar-color)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
