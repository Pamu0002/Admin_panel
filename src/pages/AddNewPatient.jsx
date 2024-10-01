import React, { useState } from 'react';
import './AddNewPatient.css';

const AddNewPatient = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    phone: '',
    gender: '',
    nic: '',
    email: '',
    bloodGroup: '',
    address: '',
    dob: '',
    allergies: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle patient registration logic here
    console.log('Patient Data Submitted:', patientData);
  };

  return (
    <div className="add-new-patient-container">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={patientData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone no:</label>
          <input type="text" name="phone" value={patientData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={patientData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>NIC:</label>
          <input type="text" name="nic" value={patientData.nic} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={patientData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Blood Group:</label>
          <input type="text" name="bloodGroup" value={patientData.bloodGroup} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={patientData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={patientData.dob} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Allergies or Other:</label>
          <input type="text" name="allergies" value={patientData.allergies} onChange={handleChange} />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default AddNewPatient;
