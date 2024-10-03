import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { db } from '../firebase-config'; // Import your Firebase configuration
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import necessary Firestore functions
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa'; // Import icons from react-icons
import './Patients.css'; // Import your CSS styles

const Patients = () => {
  const navigate = useNavigate(); // Using useNavigate hook
  const [patients, setPatients] = useState([]); // State to hold all patient data

  const navigateToAddPatient = () => {
    navigate('/addnewpatient'); // Navigate to AddNewPatient page
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientCollection = collection(db, 'Patients'); // Reference to the 'Patients' collection
        const patientSnapshot = await getDocs(patientCollection); // Fetch documents
        const patientList = patientSnapshot.docs.map(doc => ({
          referenceNo: doc.id,
          ...doc.data(),
        }));
        setPatients(patientList); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching patients:', error); // Handle any errors
      }
    };

    fetchPatients(); // Call the function to fetch patients
  }, []); // Empty dependency array to run effect once on mount

  // Function to delete a patient
  const handleDeletePatient = async (id) => {
    try {
      await deleteDoc(doc(db, 'Patients', id)); // Delete document from Firestore
      setPatients(patients.filter(patient => patient.referenceNo !== id)); // Remove from state
    } catch (error) {
      console.error('Error deleting patient:', error); // Handle any errors
    }
  };

  return (
    <div>
      <div className="patient-header">
        <button className="add-patient-button" onClick={navigateToAddPatient}>
          + Add Patient
        </button>
        <h2>Patients</h2> {/* Updated heading */}
      </div>
      <table className="patient-table">
        <thead>
          <tr>
            <th>Reference No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>NIC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.referenceNo}>
              <td>{patient.referenceNo}</td>
              <td>
                <Link to={`/patient/${patient.referenceNo}`}>{patient.name}</Link> {/* Link to patient details */}
              </td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>{patient.address}</td>
              <td>{patient.nic}</td>
              <td>
                <button className="action-button view">
                  <FaEye />
                </button>
                <button className="action-button delete" onClick={() => handleDeletePatient(patient.referenceNo)}>
                  <FaTrash />
                </button>
                <button className="action-button edit">
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;
