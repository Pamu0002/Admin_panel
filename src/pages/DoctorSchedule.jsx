import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Ensure Firebase config is correct
import { FaTrash } from 'react-icons/fa'; // Remove FaEye import
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import './DoctorSchedule.css'; // Import your CSS file

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch schedules from Firestore
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const scheduleCollection = collection(db, 'schedule'); // Collection name
        const scheduleSnapshot = await getDocs(scheduleCollection);
        
        console.log("Fetched doctors:", scheduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // Log fetched doctor documents

        const scheduleList = await Promise.all(
          scheduleSnapshot.docs.map(async (scheduleDoc) => {
            const doctorId = scheduleDoc.id;

            // Fetch subcollection 'schedules' for each doctorId
            const schedulesSubCollection = collection(db, 'schedule', doctorId, 'schedules');
            const schedulesSnapshot = await getDocs(schedulesSubCollection);

            const doctorSchedules = schedulesSnapshot.docs.map((scheduleSubDoc) => ({
              doctorId,
              scheduleId: scheduleSubDoc.id,
              ...scheduleSubDoc.data(),
            }));

            console.log(`Fetched schedules for doctor ${doctorId}:`, doctorSchedules); // Log fetched schedules for each doctor
            return doctorSchedules;
          })
        );

        // Flatten the array and update state
        setSchedules(scheduleList.flat());
        console.log("All schedules:", scheduleList.flat()); // Log all schedules
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Handle deleting a schedule
  const handleDeleteSchedule = async (doctorId, scheduleId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this schedule?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'schedule', doctorId, 'schedules', scheduleId)); // Delete document from Firestore
        setSchedules(schedules.filter((schedule) => schedule.scheduleId !== scheduleId)); // Update state
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  // Navigate to AddSchedule component
  const handleAddSchedule = () => {
    navigate('/add-schedule'); // Navigate to the AddSchedule page
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter((schedule) =>
    schedule.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctor-schedule">
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
        </div>
      </div>

      <h2>Doctor Schedule</h2>

      {loading ? (
        <p>Loading schedules...</p>
      ) : (
        <div className="table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Schedule ID</th>
                <th>Appointment Date</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Visiting Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <tr key={schedule.scheduleId}>
                    <td>{schedule.doctorId}</td>
                    <td>{schedule.scheduleId}</td>
                    <td>{schedule.appointmentDate}</td>
                    <td>{schedule.doctorName}</td>
                    <td>{schedule.specialization}</td>
                    <td>{schedule.visitingTime}</td>
                    <td>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteSchedule(schedule.doctorId, schedule.scheduleId)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No schedules found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
