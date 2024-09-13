import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import { db } from '../firebase-config';
import './AddNewPatient.css';
import { doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';

const AddNewPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    gender: '',
    address: '',
    nic: '',
    dob: ''
  });

  const [message, setMessage] = useState({
    text: '',
    type: '' // 'success' or 'error'
  });

  useEffect(() => {
    initializeUserCounts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const generatePatientId = async () => {
    try {
      const counterDocRef = doc(db, 'usercounts', 'patients');
      const counterDoc = await getDoc(counterDocRef);

      if (!counterDoc.exists()) {
        console.error('Counter document does not exist');
        throw new Error('Counter document does not exist');
      }

      const currentId = counterDoc.data().currentId || '0000';
      const newId = (parseInt(currentId, 10) + 1).toString().padStart(4, '0');

      await updateDoc(counterDocRef, { currentId: newId });
      console.log('Generated ID:', newId); // Debug statement
      return newId;
    } catch (error) {
      console.error('Error generating patient ID:', error); // Detailed error logging
      throw new Error('Failed to generate patient ID');
    }
  };

  // Function to get the current weekday
  const getCurrentWeekday = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date(); // Current date and time
    return days[currentDate.getDay()]; // Returns weekday name based on current day index
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const patientId = await generatePatientId();
      const patientData = { 
        ...formData, 
        weekday: getCurrentWeekday()  // Add the weekday field
      };

      await setDoc(doc(db, 'user', patientId), patientData);
      console.log('Patient added successfully'); // Debug statement
      setMessage({
        text: 'Patient added successfully!',
        type: 'success'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
        gender: '',
        address: '',
        nic: '',
        dob: ''
      });
    } catch (error) {
      console.error('Error adding patient:', error); // Detailed error logging
      setMessage({
        text: 'Failed to add patient. Please check the console for details.',
        type: 'error'
      });
    }
  };

  const initializeUserCounts = async () => {
    try {
      const userCountsRef = doc(db, 'usercounts', 'patients');
      const userCountsDoc = await getDoc(userCountsRef);

      if (!userCountsDoc.exists()) {
        await setDoc(userCountsRef, { currentId: '0000' });
        console.log('usercounts collection and patients document initialized');
      }
    } catch (error) {
      console.error('Error initializing usercounts:', error);
    }
  };

  return (
    <div className="add-new-patient-container">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit} className="add-patient-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <div className="input-container">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <div className="input-container">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone no:</label>
            <div className="input-container">
              <FaPhone className="input-icon" />
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group:</label>
            <input
              type="text"
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nic">NIC:</label>
            <div className="input-container">
              <FaIdCard className="input-icon" />
              <input
                type="text"
                id="nic"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <div className="input-container">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default AddNewPatient;
