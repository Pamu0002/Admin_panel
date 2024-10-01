import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase-config';
import './NewDoctor.css';

const NewDoctor = () => {
  const [doctor, setDoctor] = useState({
    id: '', // Doctor Id field added here
    fullName: '',
    gender: '',
    hospital: '',
    specialization: '',
    email: '',
    dob: '',
    nic: '',
    UserName: '',
    password: '',
    phoneNumber: '',
    status: '',
    biography: '',
    designation: ''
  });

  const [message, setMessage] = useState({
    text: '',
    type: ''
  });

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const doctorId = doctor.id;

      // Create a document in Firestore with the provided doctor Id
      const doctorRef = doc(db, 'Doctors', doctorId);
      await setDoc(doctorRef, { ...doctor });

      setMessage({ text: 'Doctor added successfully!', type: 'success' });

      // Reset form fields after submission
      setDoctor({
        id: '',
        fullName: '',
        gender: '',
        hospital: '',
        specialization: '',
        email: '',
        dob: '',
        nic: '',
        UserName: '',
        password: '',
        phoneNumber: '',
        status: '',
        biography: '',
        designation: ''
      });

    } catch (error) {
      console.error('Error adding doctor:', error.message);
      setMessage({ text: 'Error adding doctor. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="form-container">
      <h2>Register a Doctor</h2>
      <form className="doctor-form" onSubmit={handleSubmit}>
        
        <div className="form-group-half">
          <label>Doctor Id:</label>
          <input type="text" name="id" value={doctor.id} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Full Name:</label>
          <input type="text" name="fullName" value={doctor.fullName} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Gender:</label>
          <input type="text" name="gender" value={doctor.gender} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Hospital:</label>
          <input type="text" name="hospital" value={doctor.hospital} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Specialization:</label>
          <input name="specialization" value={doctor.specialization} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={doctor.dob} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Email:</label>
          <input type="email" name="email" value={doctor.email} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>NIC:</label>
          <input type="text" name="nic" value={doctor.nic} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>User Name:</label>
          <input type="text" name="UserName" value={doctor.UserName} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Password:</label>
          <input type="password" name="password" value={doctor.password} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Phone Number:</label>
          <input type="tel" name="phoneNumber" value={doctor.phoneNumber} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Status:</label>
          <input type="text" name="status" value={doctor.status} onChange={handleChange} required />
        </div>

        <div className="form-group-full">
          <label>Biography:</label>
          <textarea name="biography" value={doctor.biography} onChange={handleChange} rows="3" required />
        </div>

        <div className="form-group-half">
          <label>Designation:</label>
          <input type="text" name="designation" value={doctor.designation} onChange={handleChange} required />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-button">Register</button>
        </div>
      </form>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
};

export default NewDoctor;
