import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for back navigation
import { db } from '../firebase-config'; // Import your Firebase config
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import './AddNewPatient.css';

const AddNewPatient = () => {
  const [patientData, setPatientData] = useState({
    referenceNo: '',
    name: '',
    phone: '',
    gender: '',
    nic: '',
    email: '', // Optional email field
    bloodGroup: '',
    address: '',
    dob: '',
    allergies: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Use navigate for back button

  // Function to generate the reference number
  const generateReferenceNo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Patients'));
      const totalPatients = querySnapshot.size + 1;
      const referenceNo = `REF-2024-${totalPatients}`;
      setPatientData((prevData) => ({ ...prevData, referenceNo }));
    } catch (error) {
      console.error('Error generating reference number:', error);
    }
  };

  useEffect(() => {
    generateReferenceNo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'Patients', patientData.referenceNo), patientData);
      setMessage('Patient registered successfully!');
      setPatientData({
        referenceNo: '',
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
      generateReferenceNo();
    } catch (error) {
      console.error('Error registering patient:', error);
      setMessage('Failed to register patient. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="add-new-patient-container">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="form-group">
          <label>Reference No:</label>
          <input type="text" name="referenceNo" value={patientData.referenceNo} readOnly />
        </div>
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
          <label>Email (Optional):</label>
          <input type="email" name="email" value={patientData.email} onChange={handleChange} />
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
      {message && <p className="message">{message}</p>}

      {/* Back Button */}
      <button onClick={handleBack} className="back-button">Back</button>
    </div>
  );
};

export default AddNewPatient;
