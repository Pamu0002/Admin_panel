import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Ensure your Firebase config is correctly set up
import { FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import './DoctorSchedule.css'; // Link the correct CSS file for styling

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Fetch schedules from Firebase
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const scheduleCollection = collection(db, 'DoctorSchedules'); // Collection name in Firestore
        const scheduleSnapshot = await getDocs(scheduleCollection);
        const scheduleList = scheduleSnapshot.docs.map((doc) => ({
          id: doc.id, // Firebase document ID
          ...doc.data(),
        }));
        setSchedules(scheduleList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Delete a schedule entry
  const handleDeleteSchedule = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this schedule?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'DoctorSchedules', id)); // Delete from Firebase
        setSchedules(schedules.filter((schedule) => schedule.id !== id)); // Update local state
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter((schedule) =>
    schedule.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to the AddSchedule component when the button is clicked
  const handleAddSchedule = () => {
    navigate('/add-schedule'); // Navigate to AddSchedule route
  };

  return (
    <div className="doctor-schedule compact">
      <div className="header">
        <button className="schedule-button" onClick={handleAddSchedule}>
          + Add Schedule
        </button>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Doctor here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      <h2>Doctor Schedule</h2>

      {loading ? (
        <p>Loading schedules...</p>
      ) : (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Schedule Date</th>
              <th>Doctor Name</th>
              <th>Visiting Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.date}</td> {/* Schedule Date displayed here */}
                <td>{schedule.doctorName}</td>
                <td>{schedule.visitingTime}</td>
                <td className={schedule.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {schedule.status}
                </td>
                <td>
                  <button className="action-btn view-btn">
                    <FaEye />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDeleteSchedule(schedule.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="back-button">Back</button>
    </div>
  );
};

export default DoctorSchedule;
