import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import statement
import { db } from '../firebase-config'; // Import Firestore configuration
import { collection, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import './DoctorSchedule.css';

const DoctorSchedule = () => {
    const navigate = useNavigate(); // Updated to useNavigate
    const [schedules, setSchedules] = useState([]); // State to store fetched schedule data

    useEffect(() => {
        // Function to fetch data from Firestore
        const fetchSchedules = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "schedule")); // Fetch documents from 'schedule' collection
                const fetchedSchedules = [];
                querySnapshot.forEach((doc) => {
                    fetchedSchedules.push({ id: doc.id, ...doc.data() }); // Push each document's data into the array
                });
                setSchedules(fetchedSchedules); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching schedules: ", error);
            }
        };

        fetchSchedules(); // Call fetch function when the component mounts
    }, []); // Empty dependency array ensures this runs only once

    const handleAddSchedule = () => {
        navigate('/add-schedule'); // Updated navigation method
    };

    return (
        <div className="doctor-schedule">
            <button className="schedule-btn" onClick={handleAddSchedule}>+ Schedule Time</button>
            <h2>Doctor Schedule</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Doctor Name</th>
                        <th>Weekday</th>
                        <th>Visiting Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((schedule, index) => (
                        <tr key={schedule.id}>
                            <td>{schedule.id}</td> {/* Display document ID */}
                            <td>{schedule.doctorName}</td>
                            <td>{schedule.weekday}</td>
                            <td>{schedule.visitingTime}</td>
                            <td className="active-status">Active</td> {/* Assuming status is always Active */}
                            <td><button className="action-btn">🔍</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorSchedule;
