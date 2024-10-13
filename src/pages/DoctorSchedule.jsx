import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DoctorSchedule.css';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch schedules from Firestore and enrich with specialization
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const scheduleCollection = collection(db, 'schedule');
        const scheduleSnapshot = await getDocs(scheduleCollection);

        const scheduleList = await Promise.all(
          scheduleSnapshot.docs.map(async (scheduleDoc) => {
            const doctorId = scheduleDoc.id;
            const scheduleData = scheduleDoc.data();

            // Fetch the corresponding doctor specialization
            const doctorDoc = await getDoc(doc(db, 'Doctors', doctorId));
            const specialization = doctorDoc.exists() ? doctorDoc.data().specialization : 'N/A';

            return {
              doctorId, 
              ...scheduleData,
              specialization, 
            };
          })
        );

        setSchedules(scheduleList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Handle deleting a schedule
  const handleDeleteSchedule = async (doctorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this schedule?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'schedule', doctorId));
        setSchedules(schedules.filter((schedule) => schedule.doctorId !== doctorId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  // Toggle schedule status between 'Active' and 'Inactive'
  const toggleStatus = async (doctorId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateDoc(doc(db, 'schedule', doctorId), { status: newStatus });
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) =>
          schedule.doctorId === doctorId ? { ...schedule, status: newStatus } : schedule
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Navigate to AddSchedule component
  const handleAddSchedule = () => {
    navigate('/add-schedule');
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
              <th>Specialization</th> {/* Move specialization next to Doctor ID */}
              <th>Appointment Date</th>
              <th>Doctor Name</th>
              <th>Visiting Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.doctorId}>
                <td>{schedule.doctorId}</td> {/* Display Doctor ID */}
                <td>{schedule.specialization}</td> {/* Display specialization */}
                <td>{schedule.appointmentDate}</td> 
                <td>{schedule.doctorName}</td> 
                <td>{schedule.visitingTime}</td> 
                <td>
                  <button
                    className={`status-btn ${
                      schedule.status === 'Active' ? 'available' : 'unavailable'
                    }`}
                    onClick={() => toggleStatus(schedule.doctorId, schedule.status)}
                  >
                    {schedule.status === 'Active' ? 'Available' : 'Unavailable'}
                  </button>
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
