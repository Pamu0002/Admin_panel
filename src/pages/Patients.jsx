import React from 'react';
import { useNavigate } from 'react-router-dom';  // Updated to use useNavigate
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';  // Import icons from react-icons
import './Patients.css';

const Patients = () => {
  const navigate = useNavigate();  // Using useNavigate hook

  const navigateToAddPatient = () => {
    navigate('/addnewpatient');  // Navigate to AddNewPatient page
  };

  // Sample Patient Data
  const patients = [
    { id: 1, name: 'Mr. Weeraasingha', email: 'weera@gmail.com', phone: '+94713457890', },
    { id: 2, name: 'Mr. Weeraasingha', email: 'weera@gmail.com', phone: '+94713457890', },
    // More patient data...
  ];

  return (
    <div>
      <div className="patient-header">
        <button className="add-patient-button" onClick={navigateToAddPatient}>
          + Add Patient
        </button>
        <h2>Patient List</h2>
      </div>
      <table className="patient-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>
                {/* Add React icons for actions */}
                <button className="action-button view">
                  <FaEye />
                </button>
                <button className="action-button delete">
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
