import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config'; // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import './Prescription.css'; // Importing the CSS file for styling

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]); // State to hold the fetched prescriptions
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Fetch prescriptions from Firebase Firestore
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const prescriptionCollection = collection(db, 'Prescriptions'); // Reference to 'Prescriptions' collection
        const prescriptionSnapshot = await getDocs(prescriptionCollection); // Fetch documents from the collection
        const prescriptionList = prescriptionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrescriptions(prescriptionList); // Set prescriptions to state
      } catch (error) {
        console.error('Error fetching prescriptions:', error); // Handle any errors
      }
    };

    fetchPrescriptions(); // Fetch prescriptions on component load
  }, []);

  // Handle the "Back" button click
  const handleBackClick = () => {
    navigate('/dashboard'); // Navigate back to the dashboard or desired route
  };

  // Navigate to the PrescriptionReceipt page with prescription details
  const handleViewClick = (prescriptionId) => {
    navigate(`/prescription/${prescriptionId}`); // Navigate to PrescriptionReceipt with the prescription ID
  };

  return (
    <div className="prescription-container">
      <div className="prescription-header">
        <button className="add-button">+ Prescription</button>
        <div className="breadcrumb">
          <span>Dashboard</span> &gt; <span className="current-page">Prescription</span>
        </div>
      </div>

      <div className="prescription-table">
        <table>
          <thead>
            <tr>
              <th>Appointment Number</th> {/* Updated field name here */}
              <th>Patient Name</th>
              <th>Email</th>
              <th>Prescription ID</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length === 0 ? (
              <tr>
                <td colSpan="5">No prescriptions available</td>
              </tr>
            ) : (
              prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td>{prescription.appointmentNo}</td>
                  <td>{prescription.patientName}</td>
                  <td>{prescription.email}</td>
                  <td>{prescription.prescriptionID}</td>
                  <td>
                    <button 
                      className="prescription-btn" 
                      onClick={() => handleViewClick(prescription.id)}
                    >
                      View
                    </button> {/* Navigate to the PrescriptionReceipt page */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Prescription;
