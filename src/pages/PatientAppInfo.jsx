import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For URL parameters and navigation
import { db } from '../firebase-config'; // Firebase configuration
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions to fetch document
import './PatientAppInfo.css'; // External CSS for styling

const PatientAppInfo = () => {
  const { id } = useParams(); // Get the appointmentNumber from the URL
  const [appointment, setAppointment] = useState(null); // State to store appointment data
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // For navigation

  // Fetch appointment data from Firestore
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (!id) {
          console.error('No appointment ID provided in URL');
          setLoading(false);
          return;
        }

        // Reference to the specific document using the appointmentNumber (id)
        const appointmentRef = doc(db, 'Appointments', id); 
        const appointmentSnapshot = await getDoc(appointmentRef); // Fetch the document

        if (appointmentSnapshot.exists()) {
          setAppointment(appointmentSnapshot.data()); // Set data if the document exists
        } else {
          console.log('No such appointment found!');
        }
      } catch (error) {
        console.error('Error fetching appointment:', error); // Log any errors
      } finally {
        setLoading(false); // Stop loading after data fetch or error
      }
    };

    fetchAppointment(); // Call the fetch function when the component mounts
  }, [id]);

  const handleBackClick = () => {
    navigate('/appointments'); // Navigate back to appointments list
  };

  // Display loading until the data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-info-wrapper">
      <div className="breadcrumb">
        Dashboard &gt; Patient Appointment &gt; <span className="highlight">Patient Appointment Info</span>
      </div>

      <div className="patient-info-container">
        {/* Left section: Patient Info */}
        <div className="patient-card">
          <div className="patient-avatar">
            <i className="fas fa-user-circle avatar-icon"></i> {/* Replace with actual avatar/image if available */}
            <h3>{appointment?.patientName || ''}</h3> {/* Display Patient Name or an empty string */}
          </div>
        </div>

        {/* Right section: Appointment Info */}
        <div className="appointment-info">
          <h2 className="title">Patient Appointment Info</h2>
          <div className="appointment-details">
            <div className="left-column">
              <p><strong>Appointment Number:</strong> {appointment?.appointmentNumber || ''}</p>
              <p><strong>Doctor Name:</strong> {appointment?.doctorName || ''}</p>
              <p><strong>Specialization:</strong> {appointment?.specialization || ''}</p>
              <p><strong>Appointment Date:</strong> {appointment?.appointmentDate || ''}</p>
              <p><strong>Visiting Time:</strong> {appointment?.visitingTime || ''}</p> {/* Ensure this matches your Firestore field */}
            </div>
            <div className="right-column">
              <p><strong>Patient Name:</strong> {appointment?.patientName || ''}</p>
              <p><strong>Email:</strong> {appointment?.Email || ''}</p> {/* Match with your Firestore field */}
              <p><strong>Gender:</strong> {appointment?.Gender || ''}</p> {/* Match with your Firestore field */}
              <p><strong>Blood Group:</strong> {appointment?.BloodGroup || ''}</p> {/* Match with your Firestore field */}
              <p><strong>Phone:</strong> {appointment?.Phone || ''}</p> {/* Match with your Firestore field */}
              <p><strong>DOB:</strong> {appointment?.DOB || ''}</p> {/* Match with your Firestore field */}
            </div>
          </div>
          <button className="back-button" onClick={handleBackClick}>Back</button> {/* Back button */}
        </div>
      </div>
    </div>
  );
};

export default PatientAppInfo;
