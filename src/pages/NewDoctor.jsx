import React, { useState } from 'react';
import { db } from '../firebase-config'; 
import { doc, setDoc, getDoc, updateDoc, setDoc as setNewDoc } from 'firebase/firestore';
import './NewDoctor.css';

const NewDoctor = () => {
  const [doctor, setDoctor] = useState({
    fullName: '',
    gender: '',
    specialization: '',
    address: '',
    email: '',
    dob: '',
    nic: '',
    allergies: '',
    phoneNumber: '',
    status: '',
    bloodGroup: '',
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
      // Reference to DoctorIDs document
      const idDocRef = doc(db, 'DoctorIDs', 'current');

      // Retrieve the current ID document
      let idDoc = await getDoc(idDocRef);
      
      if (!idDoc.exists()) {
        // If the document does not exist, create it with initial ID
        await setDoc(idDocRef, { current_id: 'D00' });
        idDoc = await getDoc(idDocRef); // Retrieve the document again
      }

      const currentId = idDoc.data().current_id;
      
      // Calculate the next ID
      const nextIdNumber = parseInt(currentId.slice(1)) + 1;
      const nextId = `D${nextIdNumber.toString().padStart(2, '0')}`;

      // Add the new doctor with the new ID
      const doctorRef = doc(db, 'Doctors', nextId);
      await setDoc(doctorRef, {
        ...doctor,
        id: nextId
      });

      // Update the DoctorIDs collection with the new ID
      await updateDoc(idDocRef, { current_id: nextId });

      setMessage({
        text: 'Doctor added successfully!',
        type: 'success'
      });

      // Reset form
      setDoctor({
        fullName: '',
        gender: '',
        specialization: '',
        address: '',
        email: '',
        dob: '',
        nic: '',
        allergies: '',
        phoneNumber: '',
        status: '',
        bloodGroup: '',
        biography: '',
        designation: ''
      });

    } catch (error) {
      console.error('Error details:', error.message); // Log detailed error message
      setMessage({
        text: 'Error adding doctor. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Register a Doctor</h2>
      <form className="doctor-form" onSubmit={handleSubmit}>
        <div className="form-group-half">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={doctor.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={doctor.gender}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Specialization:</label>
          <input
            type="text"
            name="specialization"
            value={doctor.specialization}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={doctor.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={doctor.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={doctor.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>NIC:</label>
          <input
            type="text"
            name="nic"
            value={doctor.nic}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Allergies or Other:</label>
          <input
            type="text"
            name="allergies"
            value={doctor.allergies}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-half">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={doctor.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={doctor.status}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-half">
          <label>Blood Group:</label>
          <input
            type="text"
            name="bloodGroup"
            value={doctor.bloodGroup}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-full">
          <label>Biography:</label>
          <textarea
            name="biography"
            value={doctor.biography}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="form-group-full">
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={doctor.designation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-button">Register</button>
        </div>
      </form>

      {/* Display message */}
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
};

export default NewDoctor;
