import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Ensure Firebase config is correct
import { FaTrash } from 'react-icons/fa'; // Import only FaTrash since FaEye is no longer needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import './DoctorSchedule.css'; // Import your CSS file

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch schedules and doctor status from Firestore
  useEffect(() => {
    const fetchSchedulesWithStatus = async () => {
      setLoading(true); // Start loading
      try {
        const scheduleCollection = collection(db, 'schedule'); // Fetch from schedule collection
        const scheduleSnapshot = await getDocs(scheduleCollection);
        const scheduleList = await Promise.all(
          scheduleSnapshot.docs.map(async (scheduleDoc) => {
            const doctorId = scheduleDoc.id; // Get doctor ID
            const scheduleData = scheduleDoc.data(); // Get schedule data

            // Fetch the doctor’s status from the Doctors collection using the doctorId
            const doctorRef = doc(db, 'Doctors', doctorId);
            const doctorSnap = await getDoc(doctorRef);
            const doctorStatus = doctorSnap.exists() ? doctorSnap.data().status : 'Unknown'; // Get doctor status or default to 'Unknown'

            // Return schedule data combined with doctor status
            return {
              doctorId,
              ...scheduleData,
              status: doctorStatus, // Include the doctor's status
            };
          })
        );
        setSchedules(scheduleList); // Update state with schedules and status
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching schedules with status:', error);
        setLoading(false);
      }
    };

    fetchSchedulesWithStatus();
  }, []);

  // Handle deleting a schedule
  const handleDeleteSchedule = async (doctorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this schedule?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'schedule', doctorId)); // Delete document from Firestore
        setSchedules(schedules.filter((schedule) => schedule.doctorId !== doctorId)); // Update state
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
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Doctor ID</th> {/* Doctor ID column */}
              <th>Appointment Date</th> {/* Appointment Date column */}
              <th>Doctor Name</th> {/* Doctor Name column */}
              <th>Visiting Time</th> {/* Visiting Time column */}
              <th>Status</th> {/* Doctor Status column */}
              <th>Action</th> {/* Action column */}
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.doctorId}>
                <td>{schedule.doctorId}</td> {/* Display Doctor ID */}
                <td>{schedule.appointmentDate}</td> {/* Display appointment date */}
                <td>{schedule.doctorName}</td> {/* Display doctor name */}
                <td>{schedule.visitingTime}</td> {/* Display visiting time */}
                <td className={schedule.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {schedule.status} {/* Display doctor status */}
                </td>
                <td>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteSchedule(schedule.doctorId)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default DoctorSchedule;
