import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { db } from '../firebase-config'; // Import your Firebase configuration
import { doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import './PatientInfo.css'; // Assuming external CSS file

const PatientInfo = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const [patient, setPatient] = useState(null); // State to hold patient data
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientRef = doc(db, 'Patients', id); // Reference to the specific patient document
        const patientSnapshot = await getDoc(patientRef); // Fetch the document
        if (patientSnapshot.exists()) {
          setPatient({ id, ...patientSnapshot.data() }); // Set patient data to state
        } else {
          console.log('No such document!'); // Handle case where document does not exist
        }
      } catch (error) {
        console.error('Error fetching patient:', error); // Handle any errors
      }
    };

    fetchPatient(); // Call the function to fetch patient data
  }, [id]); // Effect depends on patient ID

  // If patient data is not yet loaded, show loading message
  if (!patient) {
    return <div>Loading...</div>;
  }

  // Function to handle the "Back" button click
  const handleBackClick = () => {
    navigate('/patients'); // Navigate back to the patients list or desired route
  };

  return (
    <div className="patient-info-container">
      <div className="card">
        <div className="card-left">
          <div className="patient-avatar">
            <i className="icon"></i> {/* Replace this with an actual avatar image */}
          </div>
          <div className="patient-name">{patient.name}</div>
        </div>
        <div className="card-right">
          <h2 className="section-title">Patient Info</h2>
          <div className="patient-details">
            <div className="row">
              <div className="label">Reference no:</div>
              <div className="value">{patient.id}</div>
            </div>
            <div className="row">
              <div className="label">Name:</div>
              <div className="value">{patient.name}</div>
            </div>
            <div className="row">
              <div className="label">Address:</div>
              <div className="value">{patient.address}</div>
            </div>
            <div className="row">
              <div className="label">Email:</div>
              <div className="value">{patient.email}</div>
            </div>
            <div className="row">
              <div className="label">Phone:</div>
              <div className="value">{patient.phone}</div>
            </div>
            <div className="row">
              <div className="label">Gender:</div>
              <div className="value">{patient.gender}</div>
            </div>
            <div className="row">
              <div className="label">DOB:</div>
              <div className="value">{patient.dob}</div>
            </div>
            <div className="row">
              <div className="label">Allergies or other:</div>
              <div className="value">{patient.allergies}</div>
            </div>
            <div className="row">
              <div className="label">Blood Group:</div>
              <div className="value">{patient.bloodGroup}</div>
            </div>
            <div className="row">
              <div className="label">Status:</div>
              <div className="value status-active">Active</div>
            </div>
          </div>
          <button className="back-button" onClick={handleBackClick}>Back</button> {/* Attach the click handler */}
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
