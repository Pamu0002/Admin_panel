import React from 'react';
import './Prescription.css'; // Importing the CSS file for styling

const Prescription = () => {
  const prescriptions = [
    {
      appointmentNo: 1,
      patientName: "Pamudi Dayaratne",
      email: "pamu@gmail.com",
      prescriptionID: "001",
    },
    {
      appointmentNo: 1,
      patientName: "Pamudi Dayaratne",
      email: "pamu@gmail.com",
      prescriptionID: "001",
    },
  ];

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
              <th>Appointment No</th>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Prescription ID</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription, index) => (
              <tr key={index}>
                <td>{prescription.appointmentNo}</td>
                <td>{prescription.patientName}</td>
                <td>{prescription.email}</td>
                <td>{prescription.prescriptionID}</td>
                <td>
                  <button className="prescription-btn">Prescription</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="back-button-container">
        <button className="back-button">Back</button>
      </div>
    </div>
  );
};

export default Prescription;
