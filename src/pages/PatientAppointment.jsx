import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config'; // Import Firebase config
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './PatientAppointment.css'; // Import the relevant CSS

const PatientAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch all appointments from Firestore and order by appointmentNumber
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentCollection = collection(db, 'Appointments');
        const appointmentQuery = query(appointmentCollection, orderBy('appointmentNumber', 'asc')); // Order by appointmentNumber
        const appointmentSnapshot = await getDocs(appointmentQuery); // Fetch ordered appointments
        const appointmentList = appointmentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentList); // Set state with fetched data
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle appointment deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'Appointments', id)); // Delete appointment from Firestore
        setAppointments(appointments.filter((appointment) => appointment.id !== id)); // Remove deleted appointment from state
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  // Generate the next appointment number
  const getNextAppointmentNumber = () => {
    if (appointments.length === 0) {
      return 1; // Start from 1 if no appointments exist
    }
    // Get the highest appointmentNumber from current appointments
    const highestAppointmentNumber = Math.max(...appointments.map((appointment) => parseInt(appointment.appointmentNumber, 10)));
    return highestAppointmentNumber + 1; // Increment by 1
  };

  // Function to handle making a new appointment
  const handleAddAppointment = async (doctorName, patientName, appointmentDate, visitingTime, specialization) => {
    const nextAppointmentNumber = getNextAppointmentNumber(); // Generate next appointment number

    try {
      const newAppointmentRef = await addDoc(collection(db, 'Appointments'), {
        appointmentNumber: nextAppointmentNumber.toString(), // Store as string with the field name appointmentNumber
        doctorName,
        patientName,
        appointmentDate,
        visitingTime,
        specialization, // Include the specialization field
      });

      // Add the new appointment to the state
      setAppointments((prevAppointments) => [
        ...prevAppointments,
        {
          id: newAppointmentRef.id, // Firebase document ID for future operations
          appointmentNumber: nextAppointmentNumber.toString(), // Display appointment number
          doctorName,
          patientName,
          appointmentDate,
          visitingTime,
          specialization, // Include specialization in the new appointment
        },
      ]);
    } catch (error) {
      console.error('Error making appointment:', error);
    }
  };

  // Handle filtering based on search query
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to navigate to PatientAppInfo
  const handleDoctorClick = (doctorName) => {
    navigate('/patientappinfo', { state: { doctorName } }); // Navigate to PatientAppInfo and pass doctor name
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <button
          className="add-appointment-btn"
          onClick={() => navigate('/addappointment')} // Navigate to Add Appointment page
        >
          Add Appointment +
        </button>
        <div className="breadcrumb">
          <span>Dashboard</span> &gt; <span className="current-page">Patient Appointments</span>
        </div>
        <input
          type="text"
          className="search-bar"
          placeholder="Search Doctor here"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Appointment Number</th>
              <th>Specialization</th> {/* New column for specialization */}
              <th>Doctor Name</th>
              <th>Patient Name</th>
              <th>Appointment Date</th>
              <th>Visiting Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="6">No appointments found</td> {/* Adjusted colspan */}
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.appointmentNumber}</td>
                  <td>{appointment.specialization}</td> {/* Display specialization */}
                  <td>
                    <span
                      className="doctor-name-link" // Class for styling
                      onClick={() => handleDoctorClick(appointment.doctorName)} // Add click event to navigate
                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Inline styles for a link effect
                    >
                      {appointment.doctorName}
                    </span>
                  </td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.visitingTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PatientAppointment;
