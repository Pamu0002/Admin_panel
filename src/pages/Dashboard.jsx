import React, { useEffect, useState } from 'react';
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaCalendarAlt } from 'react-icons/fa';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase-config'; // Ensure correct path to firebase config
import './Dashboard.css'; // Ensure this CSS file is correctly imported
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'; // Import Recharts components
import { isAfter, parseISO } from 'date-fns'; // Import date-fns functions for date comparison

const Dashboard = () => {
    const [doctorCount, setDoctorCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0); // Total appointments count
    const [pendingAppointmentCount, setPendingAppointmentCount] = useState(0); // Pending appointments count
    const [chartData, setChartData] = useState([]);
    const [lineChartData, setLineChartData] = useState([]); // State for line chart data

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Doctors Count
                const doctorsCollection = collection(db, 'Doctors');
                const doctorsSnapshot = await getDocs(doctorsCollection);
                setDoctorCount(doctorsSnapshot.size); // Count of doctors

                // Fetch Patients Count
                const patientsCollection = collection(db, 'Patients');
                const patientsSnapshot = await getDocs(patientsCollection);
                setPatientCount(patientsSnapshot.size); // Set total patient count

                const patientData = patientsSnapshot.docs.map(doc => doc.data());

                // Initialize data structure for weekdays
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const chartDataInit = days.map(day => ({
                    day,
                    patients: 0,
                    appointments: 0, // Placeholder for pending appointments
                }));

                // Fill the chart data with patient data from Firestore
                patientData.forEach(patient => {
                    const { weekday } = patient;
                    const dayIndex = days.indexOf(weekday);
                    if (dayIndex !== -1) {
                        chartDataInit[dayIndex].patients += 1; // Count patients
                    }
                });

                // Fetch Appointments Data
                const appointmentsCollection = collection(db, 'Appointments');
                const appointmentsSnapshot = await getDocs(appointmentsCollection);
                
                setAppointmentCount(appointmentsSnapshot.size); // Set total number of appointments (document count)

                const appointmentsData = appointmentsSnapshot.docs.map(doc => doc.data());
                const today = new Date();
                let pendingCount = 0;

                // Check for pending appointments (future dates)
                appointmentsData.forEach(appointment => {
                    let appointmentDate;
                    
                    // Handle both Firestore Timestamp and string formats
                    if (appointment.appointmentDate instanceof Date) {
                        appointmentDate = appointment.appointmentDate; // If stored as Firestore Timestamp, it is a Date object
                    } else if (typeof appointment.appointmentDate === 'string') {
                        appointmentDate = parseISO(appointment.appointmentDate); // Parse string date
                    }

                    if (appointmentDate && isAfter(appointmentDate, today)) { // Check if the date is in the future
                        pendingCount += 1; // Increment pending appointment count
                    }
                });

                // Set pending appointments count
                setPendingAppointmentCount(pendingCount);

                // Set chart data for bar chart
                setChartData(chartDataInit);

                // Prepare line chart data based on patient registrations
                const lineChartDataInit = chartDataInit.map(day => ({
                    day: day.day,
                    patientCount: day.patients // Use patient count for the line graph
                }));
                setLineChartData(lineChartDataInit); // Set line chart data

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
                    <FaUserInjured size={60} /> {/* Icon for Patients */}
                    <div>
                        <div>{patientCount !== undefined ? patientCount : 0}</div> {/* Dynamic Patient Count with fallback */}
                        <div>Patients</div>
                    </div>
                </div>
                <div className="stat-item appointments">
                    <FaCalendarAlt size={60} /> {/* Icon for Total Appointments */}
                    <div>
                        <div>{appointmentCount !== undefined ? appointmentCount : 0}</div> {/* Total Appointment Count with fallback */}
                        <div>Total Appointments</div>
                    </div>
                </div>
                {/* Pending Appointments Stat */}
                <div className="stat-item pending">
                    <FaCalendarAlt size={60} /> {/* Icon for Pending */}
                    <div>
                        <div>{pendingAppointmentCount}</div> {/* Dynamic Pending Appointment Count */}
                        <div>Pending Appointments</div>
                    </div>
                </div>
            </div>
            <div className="charts">
                <div className="chart">
                    {/* Bar Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis interval={0} domain={[0, 'dataMax + 4']} tickCount={6} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="patients" fill="var(--patients-bar-color)" />
                            <Bar dataKey="appointments" fill="var(--appointments-bar-color)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="line-chart">
                    {/* Line Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="patientCount" stroke="var(--patients-bar-color)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
