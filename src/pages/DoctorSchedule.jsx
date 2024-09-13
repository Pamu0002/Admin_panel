import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import statement
import { db } from '../firebase-config'; // Import Firestore configuration
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon from react-icons
import './DoctorSchedule.css';

const DoctorSchedule = () => {
    const navigate = useNavigate(); // Updated to useNavigate
    const [schedules, setSchedules] = useState([]); // State to store fetched schedule data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors

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
                setError("Error fetching schedules: " + error.message); // Update error state
            } finally {
                setLoading(false); // Update loading status
            }
        };

        fetchSchedules(); // Call fetch function when the component mounts
    }, []); // Empty dependency array ensures this runs only once

    const handleAddSchedule = () => {
        navigate('/add-schedule'); // Updated navigation method
    };

    const handleDeleteSchedule = async (id) => {
        try {
            await deleteDoc(doc(db, "schedule", id)); // Delete document from Firestore
            setSchedules(schedules.filter(schedule => schedule.id !== id)); // Update state to remove deleted schedule
        } catch (error) {
            console.error("Error deleting schedule: ", error);
        }
    };

    if (loading) return <div>Loading...</div>; // Display loading indicator
    if (error) return <div>{error}</div>; // Display error message

    return (
        <div className="doctor-schedule">
            <button className="schedule-btn" onClick={handleAddSchedule}>+ Schedule Time</button>
            <h2>Doctor Schedule</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Doctor Name</th>
                        <th>Date</th>
                        <th>Visiting Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((schedule) => (
                        <tr key={schedule.id}>
                            <td>{schedule.id}</td> {/* Display document ID */}
                            <td>{schedule.doctorName}</td>
                            <td>{schedule.appointmentDate}</td>
                            <td>{schedule.visitingTime}</td>
                            <td>{schedule.status || 'Active'}</td> {/* Display status */}
                            <td>
                                <button className="action-btn" onClick={() => handleDeleteSchedule(schedule.id)}>
                                    <FaTrashAlt /> {/* Delete icon */}
                                </button>
                                {/* Add more action buttons as needed */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorSchedule;
